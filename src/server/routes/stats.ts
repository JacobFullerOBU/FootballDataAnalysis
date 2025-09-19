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

// PUT endpoint to update team stats for a specific game
router.put('/team/:gameId/:teamId', async (req, res) => {
  try {
    const { gameId, teamId } = req.params;
    const statsData = req.body;
    const db = req.app.locals.database.getDatabase();
    
    // Validate required fields
    if (!statsData || typeof statsData !== 'object') {
      res.status(400).json({ error: 'Invalid stats data provided' });
      return;
    }
    
    // Build dynamic update query based on provided fields
    const allowedFields = [
      'total_yards', 'passing_yards', 'rushing_yards', 'turnovers', 
      'penalties', 'penalty_yards', 'time_of_possession', 
      'third_down_conversions', 'fourth_down_conversions'
    ];
    
    const updateFields = [];
    const values = [];
    
    for (const field of allowedFields) {
      if (statsData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(statsData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      res.status(400).json({ error: 'No valid fields provided for update' });
      return;
    }
    
    values.push(gameId, teamId);
    
    const updateQuery = `
      UPDATE team_stats 
      SET ${updateFields.join(', ')}
      WHERE game_id = ? AND team_id = ?
    `;
    
    db.run(updateQuery, values, function(this: any, err: any) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Team stats not found' });
        return;
      }
      
      res.json({ 
        message: 'Team stats updated successfully',
        gameId: parseInt(gameId),
        teamId: parseInt(teamId),
        updatedFields: Object.keys(statsData).filter(key => allowedFields.includes(key))
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint to create new team stats
router.post('/team', async (req, res) => {
  try {
    const statsData = req.body;
    const db = req.app.locals.database.getDatabase();
    
    // Validate required fields
    if (!statsData || !statsData.game_id || !statsData.team_id) {
      res.status(400).json({ error: 'game_id and team_id are required' });
      return;
    }
    
    // Check if stats already exist for this game and team
    const existingQuery = `
      SELECT id FROM team_stats WHERE game_id = ? AND team_id = ?
    `;
    
    db.get(existingQuery, [statsData.game_id, statsData.team_id], (err: any, row: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (row) {
        res.status(409).json({ error: 'Team stats already exist for this game. Use PUT to update.' });
        return;
      }
      
      // Prepare insert data with defaults
      const insertData = {
        game_id: statsData.game_id,
        team_id: statsData.team_id,
        total_yards: statsData.total_yards || 0,
        passing_yards: statsData.passing_yards || 0,
        rushing_yards: statsData.rushing_yards || 0,
        turnovers: statsData.turnovers || 0,
        penalties: statsData.penalties || 0,
        penalty_yards: statsData.penalty_yards || 0,
        time_of_possession: statsData.time_of_possession || null,
        third_down_conversions: statsData.third_down_conversions || null,
        fourth_down_conversions: statsData.fourth_down_conversions || null
      };
      
      const insertQuery = `
        INSERT INTO team_stats (
          game_id, team_id, total_yards, passing_yards, rushing_yards,
          turnovers, penalties, penalty_yards, time_of_possession,
          third_down_conversions, fourth_down_conversions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        insertData.game_id, insertData.team_id, insertData.total_yards,
        insertData.passing_yards, insertData.rushing_yards, insertData.turnovers,
        insertData.penalties, insertData.penalty_yards, insertData.time_of_possession,
        insertData.third_down_conversions, insertData.fourth_down_conversions
      ];
      
      db.run(insertQuery, values, function(this: any, err: any) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.status(201).json({
          message: 'Team stats created successfully',
          id: this.lastID,
          gameId: insertData.game_id,
          teamId: insertData.team_id
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT endpoint to update player stats for a specific game
router.put('/player/:gameId/:playerId', async (req, res) => {
  try {
    const { gameId, playerId } = req.params;
    const statsData = req.body;
    const db = req.app.locals.database.getDatabase();
    
    // Validate required fields
    if (!statsData || typeof statsData !== 'object') {
      res.status(400).json({ error: 'Invalid stats data provided' });
      return;
    }
    
    // Build dynamic update query based on provided fields
    const allowedFields = [
      'passing_yards', 'passing_touchdowns', 'rushing_yards', 'rushing_touchdowns',
      'receiving_yards', 'receiving_touchdowns', 'tackles', 'sacks', 'interceptions'
    ];
    
    const updateFields = [];
    const values = [];
    
    for (const field of allowedFields) {
      if (statsData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(statsData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      res.status(400).json({ error: 'No valid fields provided for update' });
      return;
    }
    
    values.push(gameId, playerId);
    
    const updateQuery = `
      UPDATE player_stats 
      SET ${updateFields.join(', ')}
      WHERE game_id = ? AND player_id = ?
    `;
    
    db.run(updateQuery, values, function(this: any, err: any) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Player stats not found' });
        return;
      }
      
      res.json({ 
        message: 'Player stats updated successfully',
        gameId: parseInt(gameId),
        playerId: parseInt(playerId),
        updatedFields: Object.keys(statsData).filter(key => allowedFields.includes(key))
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint to create new player stats
router.post('/player', async (req, res) => {
  try {
    const statsData = req.body;
    const db = req.app.locals.database.getDatabase();
    
    // Validate required fields
    if (!statsData || !statsData.game_id || !statsData.player_id || !statsData.team_id) {
      res.status(400).json({ error: 'game_id, player_id, and team_id are required' });
      return;
    }
    
    // Check if stats already exist for this game and player
    const existingQuery = `
      SELECT id FROM player_stats WHERE game_id = ? AND player_id = ?
    `;
    
    db.get(existingQuery, [statsData.game_id, statsData.player_id], (err: any, row: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (row) {
        res.status(409).json({ error: 'Player stats already exist for this game. Use PUT to update.' });
        return;
      }
      
      // Prepare insert data with defaults
      const insertData = {
        game_id: statsData.game_id,
        player_id: statsData.player_id,
        team_id: statsData.team_id,
        passing_yards: statsData.passing_yards || 0,
        passing_touchdowns: statsData.passing_touchdowns || 0,
        rushing_yards: statsData.rushing_yards || 0,
        rushing_touchdowns: statsData.rushing_touchdowns || 0,
        receiving_yards: statsData.receiving_yards || 0,
        receiving_touchdowns: statsData.receiving_touchdowns || 0,
        tackles: statsData.tackles || 0,
        sacks: statsData.sacks || 0,
        interceptions: statsData.interceptions || 0
      };
      
      const insertQuery = `
        INSERT INTO player_stats (
          game_id, player_id, team_id, passing_yards, passing_touchdowns,
          rushing_yards, rushing_touchdowns, receiving_yards, receiving_touchdowns,
          tackles, sacks, interceptions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        insertData.game_id, insertData.player_id, insertData.team_id,
        insertData.passing_yards, insertData.passing_touchdowns,
        insertData.rushing_yards, insertData.rushing_touchdowns,
        insertData.receiving_yards, insertData.receiving_touchdowns,
        insertData.tackles, insertData.sacks, insertData.interceptions
      ];
      
      db.run(insertQuery, values, function(this: any, err: any) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.status(201).json({
          message: 'Player stats created successfully',
          id: this.lastID,
          gameId: insertData.game_id,
          playerId: insertData.player_id,
          teamId: insertData.team_id
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});