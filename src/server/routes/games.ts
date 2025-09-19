import express from 'express';
import { Database } from '../services/database';

const router = express.Router();
const database = new Database();

// Get all games for a specific week and season
router.get('/week/:season/:week', async (req, res) => {
  try {
    const { season, week } = req.params;
    const { type } = req.query; // 'nfl' or 'college'
    
    const db = database.getDatabase();
    
    let query = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE g.season = ? AND g.week = ?
    `;
    
    const params = [season, week];
    
    if (type) {
      query += ' AND g.type = ?';
      params.push(type as string);
    }
    
    query += ' ORDER BY g.game_date';
    
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

// Get a specific game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = database.getDatabase();
    
    const query = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE g.id = ?
    `;
    
    db.get(query, [id], (err: any, row: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      res.json(row);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent games
router.get('/recent/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit as string) || 10;
    const { type } = req.query;
    
    const db = database.getDatabase();
    
    let query = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE g.status = 'completed'
    `;
    
    const params: any[] = [];
    
    if (type) {
      query += ' AND g.type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY g.game_date DESC LIMIT ?';
    params.push(limit);
    
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

// Get upcoming games
router.get('/upcoming/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit as string) || 10;
    const { type } = req.query;
    
    const db = database.getDatabase();
    
    let query = `
      SELECT g.*, 
             ht.name as home_team_name, ht.abbreviation as home_team_abbr,
             at.name as away_team_name, at.abbreviation as away_team_abbr
      FROM games g
      JOIN teams ht ON g.home_team_id = ht.id
      JOIN teams at ON g.away_team_id = at.id
      WHERE g.status = 'scheduled' AND g.game_date > datetime('now')
    `;
    
    const params: any[] = [];
    
    if (type) {
      query += ' AND g.type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY g.game_date ASC LIMIT ?';
    params.push(limit);
    
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

export default router;