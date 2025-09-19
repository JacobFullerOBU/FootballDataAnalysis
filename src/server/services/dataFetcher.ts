import axios from 'axios';
import cron from 'node-cron';
import { Database } from './database';

export class DataFetcher {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  // Start scheduled data fetching
  startScheduledFetching(): void {
    // Fetch data every day at 6 AM
    cron.schedule('0 6 * * *', () => {
      console.log('Starting scheduled data fetch...');
      this.fetchAllData();
    });

    // Initial fetch on startup
    setTimeout(() => {
      this.fetchAllData();
    }, 5000);
  }

  private async fetchAllData(): Promise<void> {
    try {
      await this.fetchTeams();
      await this.fetchGames();
      await this.fetchBettingLines();
      console.log('Data fetch completed successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private async fetchTeams(): Promise<void> {
    // For demo purposes, we'll create some sample teams
    // In a real implementation, you would fetch from a sports API
    const db = this.database.getDatabase();

    const nflTeams = [
      { name: 'Buffalo Bills', abbreviation: 'BUF', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'Miami Dolphins', abbreviation: 'MIA', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'New England Patriots', abbreviation: 'NE', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'New York Jets', abbreviation: 'NYJ', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'Baltimore Ravens', abbreviation: 'BAL', conference: 'AFC', division: 'North', type: 'nfl' },
      { name: 'Cincinnati Bengals', abbreviation: 'CIN', conference: 'AFC', division: 'North', type: 'nfl' },
      { name: 'Cleveland Browns', abbreviation: 'CLE', conference: 'AFC', division: 'North', type: 'nfl' },
      { name: 'Pittsburgh Steelers', abbreviation: 'PIT', conference: 'AFC', division: 'North', type: 'nfl' }
    ];

    const collegeTeams = [
      { name: 'Alabama Crimson Tide', abbreviation: 'ALA', conference: 'SEC', division: 'West', type: 'college' },
      { name: 'Georgia Bulldogs', abbreviation: 'UGA', conference: 'SEC', division: 'East', type: 'college' },
      { name: 'Ohio State Buckeyes', abbreviation: 'OSU', conference: 'Big Ten', division: 'East', type: 'college' },
      { name: 'Michigan Wolverines', abbreviation: 'MICH', conference: 'Big Ten', division: 'East', type: 'college' },
      { name: 'Texas Longhorns', abbreviation: 'TEX', conference: 'Big 12', division: '', type: 'college' },
      { name: 'Oklahoma Sooners', abbreviation: 'OU', conference: 'Big 12', division: '', type: 'college' }
    ];

    const allTeams = [...nflTeams, ...collegeTeams];

    for (const team of allTeams) {
      try {
        db.run(
          `INSERT OR IGNORE INTO teams (name, abbreviation, conference, division, type) 
           VALUES (?, ?, ?, ?, ?)`,
          [team.name, team.abbreviation, team.conference, team.division, team.type]
        );
      } catch (error) {
        console.error(`Error inserting team ${team.name}:`, error);
      }
    }

    console.log('Teams data updated');
  }

  private async fetchGames(): Promise<void> {
    // For demo purposes, we'll create some sample games
    // In a real implementation, you would fetch from a sports API like ESPN or The Odds API
    const db = this.database.getDatabase();

    // Sample games for current week
    const currentDate = new Date();
    const currentWeek = Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentSeason = currentDate.getFullYear();

    const sampleGames = [
      {
        week: currentWeek,
        season: currentSeason,
        homeTeamId: 1, // Buffalo Bills
        awayTeamId: 2, // Miami Dolphins
        gameDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'scheduled',
        type: 'nfl',
        venue: 'Highmark Stadium'
      },
      {
        week: currentWeek,
        season: currentSeason,
        homeTeamId: 9, // Alabama
        awayTeamId: 10, // Georgia
        gameDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'scheduled',
        type: 'college',
        venue: 'Bryant-Denny Stadium'
      }
    ];

    for (const game of sampleGames) {
      try {
        db.run(
          `INSERT OR IGNORE INTO games (week, season, home_team_id, away_team_id, game_date, status, type, venue) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [game.week, game.season, game.homeTeamId, game.awayTeamId, game.gameDate.toISOString(), game.status, game.type, game.venue]
        );
      } catch (error) {
        console.error('Error inserting game:', error);
      }
    }

    console.log('Games data updated');
  }

  private async fetchBettingLines(): Promise<void> {
    // For demo purposes, we'll create some sample betting lines
    // In a real implementation, you would fetch from The Odds API or similar
    const db = this.database.getDatabase();

    const sampleBettingLines = [
      {
        gameId: 1,
        bookmaker: 'DraftKings',
        pointSpread: -3.5,
        overUnder: 47.5,
        moneylineHome: -180,
        moneylineAway: 150
      },
      {
        gameId: 1,
        bookmaker: 'FanDuel',
        pointSpread: -3.0,
        overUnder: 48.0,
        moneylineHome: -175,
        moneylineAway: 145
      }
    ];

    for (const line of sampleBettingLines) {
      try {
        db.run(
          `INSERT OR REPLACE INTO betting_lines (game_id, bookmaker, point_spread, over_under, moneyline_home, moneyline_away) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [line.gameId, line.bookmaker, line.pointSpread, line.overUnder, line.moneylineHome, line.moneylineAway]
        );
      } catch (error) {
        console.error('Error inserting betting line:', error);
      }
    }

    console.log('Betting lines data updated');
  }
}