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
    // For demo purposes, we'll create comprehensive sample teams
    // In a real implementation, you would fetch from a sports API
    const db = this.database.getDatabase();

    const nflTeams = [
      // AFC East
      { name: 'Buffalo Bills', abbreviation: 'BUF', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'Miami Dolphins', abbreviation: 'MIA', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'New England Patriots', abbreviation: 'NE', conference: 'AFC', division: 'East', type: 'nfl' },
      { name: 'New York Jets', abbreviation: 'NYJ', conference: 'AFC', division: 'East', type: 'nfl' },
      // AFC North
      { name: 'Baltimore Ravens', abbreviation: 'BAL', conference: 'AFC', division: 'North', type: 'nfl' },
      { name: 'Cincinnati Bengals', abbreviation: 'CIN', conference: 'AFC', division: 'North', type: 'nfl' },
      { name: 'Cleveland Browns', abbreviation: 'CLE', conference: 'AFC', division: 'North', type: 'nfl' },
      { name: 'Pittsburgh Steelers', abbreviation: 'PIT', conference: 'AFC', division: 'North', type: 'nfl' },
      // AFC South
      { name: 'Houston Texans', abbreviation: 'HOU', conference: 'AFC', division: 'South', type: 'nfl' },
      { name: 'Indianapolis Colts', abbreviation: 'IND', conference: 'AFC', division: 'South', type: 'nfl' },
      { name: 'Jacksonville Jaguars', abbreviation: 'JAX', conference: 'AFC', division: 'South', type: 'nfl' },
      { name: 'Tennessee Titans', abbreviation: 'TEN', conference: 'AFC', division: 'South', type: 'nfl' },
      // AFC West
      { name: 'Denver Broncos', abbreviation: 'DEN', conference: 'AFC', division: 'West', type: 'nfl' },
      { name: 'Kansas City Chiefs', abbreviation: 'KC', conference: 'AFC', division: 'West', type: 'nfl' },
      { name: 'Las Vegas Raiders', abbreviation: 'LV', conference: 'AFC', division: 'West', type: 'nfl' },
      { name: 'Los Angeles Chargers', abbreviation: 'LAC', conference: 'AFC', division: 'West', type: 'nfl' },
      // NFC East
      { name: 'Dallas Cowboys', abbreviation: 'DAL', conference: 'NFC', division: 'East', type: 'nfl' },
      { name: 'New York Giants', abbreviation: 'NYG', conference: 'NFC', division: 'East', type: 'nfl' },
      { name: 'Philadelphia Eagles', abbreviation: 'PHI', conference: 'NFC', division: 'East', type: 'nfl' },
      { name: 'Washington Commanders', abbreviation: 'WAS', conference: 'NFC', division: 'East', type: 'nfl' }
    ];

    const collegeTeams = [
      // SEC
      { name: 'Alabama Crimson Tide', abbreviation: 'ALA', conference: 'SEC', division: 'West', type: 'college' },
      { name: 'Georgia Bulldogs', abbreviation: 'UGA', conference: 'SEC', division: 'East', type: 'college' },
      { name: 'LSU Tigers', abbreviation: 'LSU', conference: 'SEC', division: 'West', type: 'college' },
      { name: 'Florida Gators', abbreviation: 'FLA', conference: 'SEC', division: 'East', type: 'college' },
      { name: 'Auburn Tigers', abbreviation: 'AUB', conference: 'SEC', division: 'West', type: 'college' },
      { name: 'Tennessee Volunteers', abbreviation: 'TENN', conference: 'SEC', division: 'East', type: 'college' },
      // Big Ten
      { name: 'Ohio State Buckeyes', abbreviation: 'OSU', conference: 'Big Ten', division: 'East', type: 'college' },
      { name: 'Michigan Wolverines', abbreviation: 'MICH', conference: 'Big Ten', division: 'East', type: 'college' },
      { name: 'Penn State Nittany Lions', abbreviation: 'PSU', conference: 'Big Ten', division: 'East', type: 'college' },
      { name: 'Wisconsin Badgers', abbreviation: 'WIS', conference: 'Big Ten', division: 'West', type: 'college' },
      // Big 12
      { name: 'Texas Longhorns', abbreviation: 'TEX', conference: 'Big 12', division: '', type: 'college' },
      { name: 'Oklahoma Sooners', abbreviation: 'OU', conference: 'Big 12', division: '', type: 'college' },
      { name: 'Oklahoma State Cowboys', abbreviation: 'OKST', conference: 'Big 12', division: '', type: 'college' },
      { name: 'Baylor Bears', abbreviation: 'BAY', conference: 'Big 12', division: '', type: 'college' }
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
    // For demo purposes, we'll create comprehensive sample games
    // In a real implementation, you would fetch from a sports API like ESPN or The Odds API
    const db = this.database.getDatabase();

    // Sample games for current week and historical data
    const currentDate = new Date();
    const currentWeek = Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentSeason = currentDate.getFullYear();

    const sampleGames = [
      // Upcoming NFL games
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
        homeTeamId: 14, // Kansas City Chiefs
        awayTeamId: 15, // Las Vegas Raiders
        gameDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'scheduled',
        type: 'nfl',
        venue: 'Arrowhead Stadium'
      },
      {
        week: currentWeek,
        season: currentSeason,
        homeTeamId: 17, // Dallas Cowboys
        awayTeamId: 19, // Philadelphia Eagles
        gameDate: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        status: 'scheduled',
        type: 'nfl',
        venue: 'AT&T Stadium'
      },
      // Upcoming College games
      {
        week: currentWeek,
        season: currentSeason,
        homeTeamId: 21, // Alabama
        awayTeamId: 22, // Georgia
        gameDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'scheduled',
        type: 'college',
        venue: 'Bryant-Denny Stadium'
      },
      {
        week: currentWeek,
        season: currentSeason,
        homeTeamId: 27, // Ohio State
        awayTeamId: 28, // Michigan
        gameDate: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'scheduled',
        type: 'college',
        venue: 'Ohio Stadium'
      },
      {
        week: currentWeek,
        season: currentSeason,
        homeTeamId: 31, // Texas
        awayTeamId: 32, // Oklahoma
        gameDate: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        status: 'scheduled',
        type: 'college',
        venue: 'Darrell K Royal Stadium'
      },
      // Completed games from previous week
      {
        week: currentWeek - 1,
        season: currentSeason,
        homeTeamId: 5, // Baltimore Ravens
        awayTeamId: 6, // Cincinnati Bengals
        homeScore: 24,
        awayScore: 17,
        gameDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'completed',
        type: 'nfl',
        venue: 'M&T Bank Stadium'
      },
      {
        week: currentWeek - 1,
        season: currentSeason,
        homeTeamId: 3, // New England Patriots
        awayTeamId: 4, // New York Jets
        homeScore: 14,
        awayScore: 21,
        gameDate: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        status: 'completed',
        type: 'nfl',
        venue: 'Gillette Stadium'
      },
      {
        week: currentWeek - 1,
        season: currentSeason,
        homeTeamId: 23, // LSU
        awayTeamId: 25, // Auburn
        homeScore: 31,
        awayScore: 28,
        gameDate: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'completed',
        type: 'college',
        venue: 'Tiger Stadium'
      },
      {
        week: currentWeek - 1,
        season: currentSeason,
        homeTeamId: 29, // Penn State
        awayTeamId: 30, // Wisconsin
        homeScore: 28,
        awayScore: 14,
        gameDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'completed',
        type: 'college',
        venue: 'Beaver Stadium'
      }
    ];

    for (const game of sampleGames) {
      try {
        const values = game.homeScore !== undefined 
          ? [game.week, game.season, game.homeTeamId, game.awayTeamId, game.homeScore, game.awayScore, game.gameDate.toISOString(), game.status, game.type, game.venue]
          : [game.week, game.season, game.homeTeamId, game.awayTeamId, null, null, game.gameDate.toISOString(), game.status, game.type, game.venue];
        
        db.run(
          `INSERT OR IGNORE INTO games (week, season, home_team_id, away_team_id, home_score, away_score, game_date, status, type, venue) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          values
        );
      } catch (error) {
        console.error('Error inserting game:', error);
      }
    }

    console.log('Games data updated');
  }

  private async fetchBettingLines(): Promise<void> {
    // For demo purposes, we'll create comprehensive sample betting lines
    // In a real implementation, you would fetch from The Odds API or similar
    const db = this.database.getDatabase();

    const sampleBettingLines = [
      // Game 1 (Bills vs Dolphins) - Multiple bookmakers
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
      },
      {
        gameId: 1,
        bookmaker: 'BetMGM',
        pointSpread: -4.0,
        overUnder: 47.0,
        moneylineHome: -185,
        moneylineAway: 155
      },
      // Game 2 (Chiefs vs Raiders)
      {
        gameId: 2,
        bookmaker: 'DraftKings',
        pointSpread: -7.0,
        overUnder: 52.5,
        moneylineHome: -340,
        moneylineAway: 280
      },
      {
        gameId: 2,
        bookmaker: 'FanDuel',
        pointSpread: -6.5,
        overUnder: 53.0,
        moneylineHome: -335,
        moneylineAway: 275
      },
      {
        gameId: 2,
        bookmaker: 'Caesars',
        pointSpread: -7.5,
        overUnder: 52.0,
        moneylineHome: -350,
        moneylineAway: 290
      },
      // Game 3 (Cowboys vs Eagles)
      {
        gameId: 3,
        bookmaker: 'DraftKings',
        pointSpread: -2.5,
        overUnder: 49.5,
        moneylineHome: -140,
        moneylineAway: 120
      },
      {
        gameId: 3,
        bookmaker: 'FanDuel',
        pointSpread: -3.0,
        overUnder: 50.0,
        moneylineHome: -145,
        moneylineAway: 125
      },
      // Game 4 (Alabama vs Georgia) - College
      {
        gameId: 4,
        bookmaker: 'DraftKings',
        pointSpread: -4.5,
        overUnder: 55.5,
        moneylineHome: -200,
        moneylineAway: 170
      },
      {
        gameId: 4,
        bookmaker: 'FanDuel',
        pointSpread: -4.0,
        overUnder: 56.0,
        moneylineHome: -195,
        moneylineAway: 165
      },
      {
        gameId: 4,
        bookmaker: 'BetMGM',
        pointSpread: -5.0,
        overUnder: 55.0,
        moneylineHome: -210,
        moneylineAway: 180
      },
      // Game 5 (Ohio State vs Michigan) - College
      {
        gameId: 5,
        bookmaker: 'DraftKings',
        pointSpread: -1.5,
        overUnder: 58.5,
        moneylineHome: -120,
        moneylineAway: 100
      },
      {
        gameId: 5,
        bookmaker: 'FanDuel',
        pointSpread: -2.0,
        overUnder: 59.0,
        moneylineHome: -125,
        moneylineAway: 105
      },
      // Game 6 (Texas vs Oklahoma) - College
      {
        gameId: 6,
        bookmaker: 'DraftKings',
        pointSpread: -6.5,
        overUnder: 61.5,
        moneylineHome: -280,
        moneylineAway: 230
      },
      {
        gameId: 6,
        bookmaker: 'FanDuel',
        pointSpread: -6.0,
        overUnder: 62.0,
        moneylineHome: -275,
        moneylineAway: 225
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