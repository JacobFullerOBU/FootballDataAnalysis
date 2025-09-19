import express from 'express';

const router = express.Router();

// Get betting lines for a specific game
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    const query = `
      SELECT bl.*, 
             g.game_date,
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM betting_lines bl
      JOIN games g ON bl.game_id = g.id
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE bl.game_id = ?
      ORDER BY bl.timestamp DESC
    `;
    
    db.all(query, [gameId], (err: any, rows: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get latest betting lines for upcoming games
router.get('/upcoming/:type?', async (req, res) => {
  try {
    const { type } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const db = req.app.locals.database.getDatabase();
    
    let query = `
      SELECT DISTINCT bl.game_id,
             MAX(bl.timestamp) as latest_timestamp,
             g.game_date, g.week, g.season,
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM betting_lines bl
      JOIN games g ON bl.game_id = g.id
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE g.status = 'scheduled' AND g.game_date > datetime('now')
    `;
    
    const params: any[] = [];
    
    if (type && type !== 'all') {
      query += ' AND g.type = ?';
      params.push(type);
    }
    
    query += `
      GROUP BY bl.game_id
      ORDER BY g.game_date ASC
      LIMIT ?
    `;
    params.push(limit);
    
    db.all(query, params, (err: any, gameRows: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (gameRows.length === 0) {
        res.json([]);
        return;
      }
      
      // Get the actual betting lines for each game
      const gameIds = gameRows.map((row: any) => row.game_id);
      const placeholders = gameIds.map(() => '?').join(',');
      
      const linesQuery = `
        SELECT bl.*
        FROM betting_lines bl
        WHERE bl.game_id IN (${placeholders})
        ORDER BY bl.game_id, bl.timestamp DESC
      `;
      
      db.all(linesQuery, gameIds, (err: any, linesRows: any) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Group lines by game
        const gamesWithLines = gameRows.map((game: any) => {
          const gameLines = linesRows.filter((line: any) => line.game_id === game.game_id);
          
          // Get latest line from each bookmaker
          const latestLines = gameLines.reduce((acc: any, line: any) => {
            if (!acc[line.bookmaker] || new Date(line.timestamp) > new Date(acc[line.bookmaker].timestamp)) {
              acc[line.bookmaker] = line;
            }
            return acc;
          }, {});
          
          return {
            ...game,
            bettingLines: Object.values(latestLines as any)
          };
        });
        
        res.json(gamesWithLines);
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get betting line comparison for a specific game
router.get('/compare/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    const query = `
      SELECT bookmaker,
             point_spread, over_under, moneyline_home, moneyline_away,
             timestamp
      FROM betting_lines
      WHERE game_id = ?
      ORDER BY bookmaker, timestamp DESC
    `;
    
    db.all(query, [gameId], (err: any, rows: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get latest from each bookmaker
      const latestByBookmaker = rows.reduce((acc: any, line: any) => {
        if (!acc[line.bookmaker] || new Date(line.timestamp) > new Date(acc[line.bookmaker].timestamp)) {
          acc[line.bookmaker] = line;
        }
        return acc;
      }, {});
      
      const comparison = Object.values(latestByBookmaker as any) as any[];
      
      // Calculate spreads
      if (comparison.length > 1) {
        const spreads = comparison.map((line: any) => line.point_spread).filter(s => s !== null);
        const overUnders = comparison.map((line: any) => line.over_under).filter(ou => ou !== null);
        
        const analysis = {
          spreadRange: spreads.length > 0 ? {
            min: Math.min(...spreads),
            max: Math.max(...spreads),
            average: spreads.reduce((a, b) => a + b, 0) / spreads.length
          } : null,
          overUnderRange: overUnders.length > 0 ? {
            min: Math.min(...overUnders),
            max: Math.max(...overUnders),
            average: overUnders.reduce((a, b) => a + b, 0) / overUnders.length
          } : null
        };
        
        res.json({
          gameId: parseInt(gameId),
          bookmakers: comparison,
          analysis
        });
      } else {
        res.json({
          gameId: parseInt(gameId),
          bookmakers: comparison,
          analysis: null
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get betting trends for a team
router.get('/trends/team/:teamId/:season', async (req, res) => {
  try {
    const { teamId, season } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    const query = `
      SELECT g.id as game_id, g.week, g.home_score, g.away_score,
             g.home_team_id, g.away_team_id,
             bl.point_spread, bl.over_under,
             CASE 
               WHEN g.home_team_id = ? THEN 'home'
               ELSE 'away'
             END as team_location,
             CASE 
               WHEN g.home_team_id = ? THEN g.home_score
               ELSE g.away_score
             END as team_score,
             CASE 
               WHEN g.home_team_id = ? THEN g.away_score
               ELSE g.home_score
             END as opponent_score
      FROM games g
      LEFT JOIN betting_lines bl ON g.id = bl.game_id
      WHERE (g.home_team_id = ? OR g.away_team_id = ?)
        AND g.season = ?
        AND g.status = 'completed'
        AND bl.bookmaker = 'DraftKings'
      ORDER BY g.week
    `;
    
    db.all(query, [teamId, teamId, teamId, teamId, teamId, season], (err: any, rows: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const analysis = rows.map((game: any) => {
        const totalScore = (game.home_score || 0) + (game.away_score || 0);
        const scoreDiff = game.team_score - game.opponent_score;
        
        let spreadResult = null;
        let overUnderResult = null;
        
        if (game.point_spread !== null) {
          if (game.team_location === 'home') {
            spreadResult = scoreDiff > Math.abs(game.point_spread) ? 'cover' : 'no_cover';
          } else {
            spreadResult = scoreDiff > game.point_spread ? 'cover' : 'no_cover';
          }
        }
        
        if (game.over_under !== null) {
          overUnderResult = totalScore > game.over_under ? 'over' : 'under';
        }
        
        return {
          week: game.week,
          teamScore: game.team_score,
          opponentScore: game.opponent_score,
          totalScore,
          scoreDiff,
          pointSpread: game.point_spread,
          overUnder: game.over_under,
          spreadResult,
          overUnderResult,
          teamLocation: game.team_location
        };
      });
      
      res.json({
        teamId: parseInt(teamId),
        season: parseInt(season),
        games: analysis
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;