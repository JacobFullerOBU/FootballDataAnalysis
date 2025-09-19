import express from 'express';

const router = express.Router();

// Get team stats for a specific game
router.get('/team/:gameId/:teamId', async (req, res) => {
  try {
    const { gameId, teamId } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    const query = `
      SELECT ts.*, t.name as team_name, t.abbreviation as team_abbr
      FROM team_stats ts
      JOIN teams t ON ts.team_id = t.id
      WHERE ts.game_id = ? AND ts.team_id = ?
    `;
    
    db.get(query, [gameId, teamId], (err: any, row: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Team stats not found' });
        return;
      }
      res.json(row);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all team stats for a specific game
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    const query = `
      SELECT ts.*, t.name as team_name, t.abbreviation as team_abbr
      FROM team_stats ts
      JOIN teams t ON ts.team_id = t.id
      WHERE ts.game_id = ?
      ORDER BY ts.team_id
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

// Get player stats for a specific game
router.get('/players/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { teamId } = req.query;
    const db = req.app.locals.database.getDatabase();
    
    let query = `
      SELECT ps.*, p.name as player_name, p.position, p.jersey_number,
             t.name as team_name, t.abbreviation as team_abbr
      FROM player_stats ps
      JOIN players p ON ps.player_id = p.id
      JOIN teams t ON ps.team_id = t.id
      WHERE ps.game_id = ?
    `;
    
    const params = [gameId];
    
    if (teamId) {
      query += ' AND ps.team_id = ?';
      params.push(teamId as string);
    }
    
    query += ' ORDER BY ps.team_id, p.name';
    
    db.all(query, params, (err: any, rows: any) => {
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

// Get season statistics summary
router.get('/season/:season/:type', async (req, res) => {
  try {
    const { season, type } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    // Get top rushing teams
    const rushingQuery = `
      SELECT t.name as team_name, t.abbreviation, 
             AVG(ts.rushing_yards) as avg_rushing_yards,
             SUM(ts.rushing_yards) as total_rushing_yards,
             COUNT(*) as games_played
      FROM team_stats ts
      JOIN teams t ON ts.team_id = t.id
      JOIN games g ON ts.game_id = g.id
      WHERE g.season = ? AND g.type = ? AND g.status = 'completed'
      GROUP BY ts.team_id
      ORDER BY avg_rushing_yards DESC
      LIMIT 10
    `;
    
    // Get top passing teams
    const passingQuery = `
      SELECT t.name as team_name, t.abbreviation,
             AVG(ts.passing_yards) as avg_passing_yards,
             SUM(ts.passing_yards) as total_passing_yards,
             COUNT(*) as games_played
      FROM team_stats ts
      JOIN teams t ON ts.team_id = t.id
      JOIN games g ON ts.game_id = g.id
      WHERE g.season = ? AND g.type = ? AND g.status = 'completed'
      GROUP BY ts.team_id
      ORDER BY avg_passing_yards DESC
      LIMIT 10
    `;
    
    // Execute both queries
    db.all(rushingQuery, [season, type], (err: any, rushingStats: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.all(passingQuery, [season, type], (err: any, passingStats: any) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          season: parseInt(season),
          type,
          topRushingTeams: rushingStats,
          topPassingTeams: passingStats
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get weekly analysis
router.get('/weekly/:season/:week/:type', async (req, res) => {
  try {
    const { season, week, type } = req.params;
    const db = req.app.locals.database.getDatabase();
    
    // Get games for the week
    const gamesQuery = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE g.season = ? AND g.week = ? AND g.type = ? AND g.status = 'completed'
    `;
    
    db.all(gamesQuery, [season, week, type], (err: any, games: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (games.length === 0) {
        res.json({
          season: parseInt(season),
          week: parseInt(week),
          type,
          totalGames: 0,
          analysis: 'No completed games found for this week'
        });
        return;
      }
      
      // Calculate statistics
      const totalGames = games.length;
      const totalPoints = games.reduce((sum: number, game: any) => 
        sum + (game.home_score || 0) + (game.away_score || 0), 0
      );
      const averageScore = totalPoints / (totalGames * 2);
      
      // Find highest scoring game
      const highestScoringGame = games.reduce((highest: any, game: any) => {
        const gameTotal = (game.home_score || 0) + (game.away_score || 0);
        const highestTotal = (highest.home_score || 0) + (highest.away_score || 0);
        return gameTotal > highestTotal ? game : highest;
      }, games[0]);
      
      res.json({
        season: parseInt(season),
        week: parseInt(week),
        type,
        totalGames,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScoringGame,
        games
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;