// Simple betting lines endpoint for testing
import express from 'express';
import { Database } from '../services/database';

const router = express.Router();
const database = new Database();

// Simple test endpoint
router.get('/test', async (req, res) => {
  try {
    const db = database.getDatabase();
    
    db.all('SELECT COUNT(*) as count FROM games', [], (err: any, rows: any) => {
      if (err) {
        console.error('Test query error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Test successful', data: rows });
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simplified upcoming games endpoint
router.get('/upcoming-simple', async (req, res) => {
  try {
    const db = database.getDatabase();
    
    // First, get all the games and betting data in a simple query
    const query = `
      SELECT g.id as game_id, g.game_date, g.week, g.season, g.type,
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr,
             bl.bookmaker, bl.point_spread, bl.over_under, 
             bl.moneyline_home, bl.moneyline_away, bl.timestamp
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      LEFT JOIN betting_lines bl ON g.id = bl.game_id
      WHERE g.status = 'scheduled' AND g.game_date > datetime('now')
      ORDER BY g.game_date ASC, bl.timestamp DESC
      LIMIT 100
    `;
    
    console.log('Simple query:', query);
    
    db.all(query, [], (err: any, rows: any) => {
      if (err) {
        console.error('Simple query error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      console.log('Simple query found rows:', rows?.length);
      
      if (!rows || rows.length === 0) {
        res.json([]);
        return;
      }
      
      // Group by game and collect betting lines
      const gamesMap = new Map();
      
      rows.forEach((row: any) => {
        if (!gamesMap.has(row.game_id)) {
          gamesMap.set(row.game_id, {
            game_id: row.game_id,
            game_date: row.game_date,
            week: row.week,
            season: row.season,
            type: row.type,
            home_team_name: row.home_team_name,
            home_team_abbr: row.home_team_abbr,
            away_team_name: row.away_team_name,
            away_team_abbr: row.away_team_abbr,
            bettingLines: []
          });
        }
        
        if (row.bookmaker) {
          gamesMap.get(row.game_id).bettingLines.push({
            bookmaker: row.bookmaker,
            point_spread: row.point_spread,
            over_under: row.over_under,
            moneyline_home: row.moneyline_home,
            moneyline_away: row.moneyline_away,
            timestamp: row.timestamp
          });
        }
      });
      
      const result = Array.from(gamesMap.values());
      console.log('Returning games:', result.length);
      res.json(result);
    });
    
  } catch (error) {
    console.error('Simple upcoming error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;