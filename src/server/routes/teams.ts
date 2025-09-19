import express from 'express';
import { Database } from '../services/database';

const router = express.Router();
const database = new Database();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // 'nfl' or 'college'
    const db = database.getDatabase();
    
    let query = 'SELECT * FROM teams';
    const params: any[] = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY name';
    
    db.all(query, params, (err, rows) => {
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

// Get a specific team by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = database.getDatabase();
    
    db.get('SELECT * FROM teams WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Team not found' });
        return;
      }
      res.json(row);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get team's recent games
router.get('/:id/games/recent/:limit?', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.params.limit as string) || 10;
    const db = database.getDatabase();
    
    const query = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr,
             CASE 
               WHEN g.home_team_id = ? THEN 'home'
               ELSE 'away'
             END as team_location
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE (g.home_team_id = ? OR g.away_team_id = ?) 
        AND g.status = 'completed'
      ORDER BY g.game_date DESC 
      LIMIT ?
    `;
    
    db.all(query, [id, id, id, limit], (err, rows) => {
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

// Get team's upcoming games
router.get('/:id/games/upcoming/:limit?', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.params.limit as string) || 10;
    const db = database.getDatabase();
    
    const query = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr,
             CASE 
               WHEN g.home_team_id = ? THEN 'home'
               ELSE 'away'
             END as team_location
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE (g.home_team_id = ? OR g.away_team_id = ?) 
        AND g.status = 'scheduled' 
        AND g.game_date > datetime('now')
      ORDER BY g.game_date ASC 
      LIMIT ?
    `;
    
    db.all(query, [id, id, id, limit], (err, rows) => {
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

export default router;