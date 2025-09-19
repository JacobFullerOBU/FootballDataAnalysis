import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

export class Database {
  private db!: sqlite3.Database;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(__dirname, '../../../data/football.db');
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Ensure data directory exists
      const fs = require('fs');
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  private async createTables(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));

    // Teams table
    await run(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        abbreviation TEXT NOT NULL UNIQUE,
        conference TEXT,
        division TEXT,
        logo TEXT,
        color TEXT,
        type TEXT NOT NULL CHECK (type IN ('nfl', 'college')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Games table
    await run(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        week INTEGER NOT NULL,
        season INTEGER NOT NULL,
        home_team_id INTEGER NOT NULL,
        away_team_id INTEGER NOT NULL,
        home_score INTEGER,
        away_score INTEGER,
        game_date DATETIME NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'postponed')),
        type TEXT NOT NULL CHECK (type IN ('nfl', 'college')),
        venue TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (home_team_id) REFERENCES teams (id),
        FOREIGN KEY (away_team_id) REFERENCES teams (id)
      )
    `);

    // Players table
    await run(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team_id INTEGER NOT NULL,
        position TEXT,
        jersey_number INTEGER,
        type TEXT NOT NULL CHECK (type IN ('nfl', 'college')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams (id)
      )
    `);

    // Player stats table
    await run(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        team_id INTEGER NOT NULL,
        passing_yards INTEGER DEFAULT 0,
        passing_touchdowns INTEGER DEFAULT 0,
        rushing_yards INTEGER DEFAULT 0,
        rushing_touchdowns INTEGER DEFAULT 0,
        receiving_yards INTEGER DEFAULT 0,
        receiving_touchdowns INTEGER DEFAULT 0,
        tackles INTEGER DEFAULT 0,
        sacks REAL DEFAULT 0,
        interceptions INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games (id),
        FOREIGN KEY (player_id) REFERENCES players (id),
        FOREIGN KEY (team_id) REFERENCES teams (id)
      )
    `);

    // Team stats table
    await run(`
      CREATE TABLE IF NOT EXISTS team_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        team_id INTEGER NOT NULL,
        total_yards INTEGER DEFAULT 0,
        passing_yards INTEGER DEFAULT 0,
        rushing_yards INTEGER DEFAULT 0,
        turnovers INTEGER DEFAULT 0,
        penalties INTEGER DEFAULT 0,
        penalty_yards INTEGER DEFAULT 0,
        time_of_possession TEXT,
        third_down_conversions TEXT,
        fourth_down_conversions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games (id),
        FOREIGN KEY (team_id) REFERENCES teams (id)
      )
    `);

    // Betting lines table
    await run(`
      CREATE TABLE IF NOT EXISTS betting_lines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        bookmaker TEXT NOT NULL,
        point_spread REAL,
        over_under REAL,
        moneyline_home INTEGER,
        moneyline_away INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games (id)
      )
    `);

    // Create indexes for performance
    await run('CREATE INDEX IF NOT EXISTS idx_games_season_week ON games (season, week)');
    await run('CREATE INDEX IF NOT EXISTS idx_games_date ON games (game_date)');
    await run('CREATE INDEX IF NOT EXISTS idx_player_stats_game ON player_stats (game_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_team_stats_game ON team_stats (game_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_betting_lines_game ON betting_lines (game_id)');

    console.log('Database tables created successfully');
  }

  getDatabase(): sqlite3.Database {
    return this.db;
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}