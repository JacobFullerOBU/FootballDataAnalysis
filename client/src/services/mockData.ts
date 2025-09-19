import { Team, Game, BettingLine, WeeklyAnalysis, PlayerStats, TeamStats } from '../types';

// Sample Teams Data (extracted from backend dataFetcher)
export const mockTeams: Team[] = [
  // NFL Teams
  { id: 1, name: 'Buffalo Bills', abbreviation: 'BUF', conference: 'AFC', division: 'East', type: 'nfl' },
  { id: 2, name: 'Miami Dolphins', abbreviation: 'MIA', conference: 'AFC', division: 'East', type: 'nfl' },
  { id: 3, name: 'New England Patriots', abbreviation: 'NE', conference: 'AFC', division: 'East', type: 'nfl' },
  { id: 4, name: 'New York Jets', abbreviation: 'NYJ', conference: 'AFC', division: 'East', type: 'nfl' },
  { id: 5, name: 'Baltimore Ravens', abbreviation: 'BAL', conference: 'AFC', division: 'North', type: 'nfl' },
  { id: 6, name: 'Cincinnati Bengals', abbreviation: 'CIN', conference: 'AFC', division: 'North', type: 'nfl' },
  { id: 7, name: 'Cleveland Browns', abbreviation: 'CLE', conference: 'AFC', division: 'North', type: 'nfl' },
  { id: 8, name: 'Pittsburgh Steelers', abbreviation: 'PIT', conference: 'AFC', division: 'North', type: 'nfl' },
  
  // College Teams
  { id: 9, name: 'Alabama Crimson Tide', abbreviation: 'ALA', conference: 'SEC', division: 'West', type: 'college' },
  { id: 10, name: 'Georgia Bulldogs', abbreviation: 'UGA', conference: 'SEC', division: 'East', type: 'college' },
  { id: 11, name: 'Ohio State Buckeyes', abbreviation: 'OSU', conference: 'Big Ten', division: 'East', type: 'college' },
  { id: 12, name: 'Michigan Wolverines', abbreviation: 'MICH', conference: 'Big Ten', division: 'East', type: 'college' },
  { id: 13, name: 'Texas Longhorns', abbreviation: 'TEX', conference: 'Big 12', division: '', type: 'college' },
  { id: 14, name: 'Oklahoma Sooners', abbreviation: 'OU', conference: 'Big 12', division: '', type: 'college' }
];

// Generate current date-based sample games
const currentDate = new Date();
const currentWeek = Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
const currentSeason = currentDate.getFullYear();

export const mockGames: Game[] = [
  // Recent completed games
  {
    id: 1,
    week: currentWeek - 1,
    season: currentSeason,
    home_team_id: 1,
    away_team_id: 2,
    home_score: 24,
    away_score: 17,
    game_date: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'nfl',
    venue: 'Highmark Stadium',
    home_team_name: 'Buffalo Bills',
    home_team_abbr: 'BUF',
    away_team_name: 'Miami Dolphins',
    away_team_abbr: 'MIA'
  },
  {
    id: 2,
    week: currentWeek - 1,
    season: currentSeason,
    home_team_id: 5,
    away_team_id: 6,
    home_score: 31,
    away_score: 28,
    game_date: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'nfl',
    venue: 'M&T Bank Stadium',
    home_team_name: 'Baltimore Ravens',
    home_team_abbr: 'BAL',
    away_team_name: 'Cincinnati Bengals',
    away_team_abbr: 'CIN'
  },
  {
    id: 3,
    week: currentWeek - 1,
    season: currentSeason,
    home_team_id: 9,
    away_team_id: 10,
    home_score: 42,
    away_score: 35,
    game_date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'college',
    venue: 'Bryant-Denny Stadium',
    home_team_name: 'Alabama Crimson Tide',
    home_team_abbr: 'ALA',
    away_team_name: 'Georgia Bulldogs',
    away_team_abbr: 'UGA'
  },
  {
    id: 4,
    week: currentWeek - 1,
    season: currentSeason,
    home_team_id: 11,
    away_team_id: 12,
    home_score: 21,
    away_score: 14,
    game_date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'college',
    venue: 'Ohio Stadium',
    home_team_name: 'Ohio State Buckeyes',
    home_team_abbr: 'OSU',
    away_team_name: 'Michigan Wolverines',
    away_team_abbr: 'MICH'
  },
  {
    id: 5,
    week: currentWeek - 1,
    season: currentSeason,
    home_team_id: 3,
    away_team_id: 4,
    home_score: 20,
    away_score: 10,
    game_date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'nfl',
    venue: 'Gillette Stadium',
    home_team_name: 'New England Patriots',
    home_team_abbr: 'NE',
    away_team_name: 'New York Jets',
    away_team_abbr: 'NYJ'
  },
  {
    id: 6,
    week: currentWeek - 1,
    season: currentSeason,
    home_team_id: 13,
    away_team_id: 14,
    home_score: 35,
    away_score: 28,
    game_date: new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'college',
    venue: 'Darrell K Royal Stadium',
    home_team_name: 'Texas Longhorns',
    home_team_abbr: 'TEX',
    away_team_name: 'Oklahoma Sooners',
    away_team_abbr: 'OU'
  },

  // Upcoming games
  {
    id: 7,
    week: currentWeek,
    season: currentSeason,
    home_team_id: 2,
    away_team_id: 1,
    game_date: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    type: 'nfl',
    venue: 'Hard Rock Stadium',
    home_team_name: 'Miami Dolphins',
    home_team_abbr: 'MIA',
    away_team_name: 'Buffalo Bills',
    away_team_abbr: 'BUF'
  },
  {
    id: 8,
    week: currentWeek,
    season: currentSeason,
    home_team_id: 6,
    away_team_id: 8,
    game_date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    type: 'nfl',
    venue: 'Paul Brown Stadium',
    home_team_name: 'Cincinnati Bengals',
    home_team_abbr: 'CIN',
    away_team_name: 'Pittsburgh Steelers',
    away_team_abbr: 'PIT'
  },
  {
    id: 9,
    week: currentWeek,
    season: currentSeason,
    home_team_id: 10,
    away_team_id: 11,
    game_date: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    type: 'college',
    venue: 'Sanford Stadium',
    home_team_name: 'Georgia Bulldogs',
    home_team_abbr: 'UGA',
    away_team_name: 'Ohio State Buckeyes',
    away_team_abbr: 'OSU'
  },
  {
    id: 10,
    week: currentWeek,
    season: currentSeason,
    home_team_id: 12,
    away_team_id: 9,
    game_date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    type: 'college',
    venue: 'Michigan Stadium',
    home_team_name: 'Michigan Wolverines',
    home_team_abbr: 'MICH',
    away_team_name: 'Alabama Crimson Tide',
    away_team_abbr: 'ALA'
  },
  {
    id: 11,
    week: currentWeek,
    season: currentSeason,
    home_team_id: 4,
    away_team_id: 7,
    game_date: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    type: 'nfl',
    venue: 'MetLife Stadium',
    home_team_name: 'New York Jets',
    home_team_abbr: 'NYJ',
    away_team_name: 'Cleveland Browns',
    away_team_abbr: 'CLE'
  },
  {
    id: 12,
    week: currentWeek,
    season: currentSeason,
    home_team_id: 14,
    away_team_id: 13,
    game_date: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    type: 'college',
    venue: 'Gaylord Family Oklahoma Memorial Stadium',
    home_team_name: 'Oklahoma Sooners',
    home_team_abbr: 'OU',
    away_team_name: 'Texas Longhorns',
    away_team_abbr: 'TEX'
  }
];

// Sample betting lines
export const mockBettingLines: BettingLine[] = [
  {
    id: 1,
    game_id: 7,
    bookmaker: 'DraftKings',
    point_spread: -3.5,
    over_under: 47.5,
    moneyline_home: -180,
    moneyline_away: 150,
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    game_id: 7,
    bookmaker: 'FanDuel',
    point_spread: -3.0,
    over_under: 48.0,
    moneyline_home: -175,
    moneyline_away: 145,
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    game_id: 8,
    bookmaker: 'DraftKings',
    point_spread: -7.0,
    over_under: 42.5,
    moneyline_home: -320,
    moneyline_away: 260,
    timestamp: new Date().toISOString()
  },
  {
    id: 4,
    game_id: 9,
    bookmaker: 'Caesars',
    point_spread: -2.5,
    over_under: 55.5,
    moneyline_home: -140,
    moneyline_away: 120,
    timestamp: new Date().toISOString()
  }
];

// Weekly analysis data
export const mockWeeklyAnalysis: { nfl: WeeklyAnalysis, college: WeeklyAnalysis } = {
  nfl: {
    season: currentSeason,
    week: currentWeek,
    type: 'nfl',
    totalGames: 3,
    averageScore: 23.2,
    highestScoringGame: mockGames.find(g => g.id === 2)!,
    games: mockGames.filter(g => g.type === 'nfl' && g.status === 'completed')
  },
  college: {
    season: currentSeason,
    week: currentWeek,
    type: 'college',
    totalGames: 3,
    averageScore: 31.7,
    highestScoringGame: mockGames.find(g => g.id === 3)!,
    games: mockGames.filter(g => g.type === 'college' && g.status === 'completed')
  }
};

// Sample team statistics
export const mockTeamStats: TeamStats[] = [
  {
    id: 1,
    game_id: 1,
    team_id: 1,
    team_name: 'Buffalo Bills',
    team_abbr: 'BUF',
    total_yards: 385,
    passing_yards: 275,
    rushing_yards: 110,
    turnovers: 1,
    penalties: 6,
    penalty_yards: 45,
    time_of_possession: '31:25',
    third_down_conversions: '7/12',
    fourth_down_conversions: '1/2'
  },
  {
    id: 2,
    game_id: 1,
    team_id: 2,
    team_name: 'Miami Dolphins',
    team_abbr: 'MIA',
    total_yards: 320,
    passing_yards: 230,
    rushing_yards: 90,
    turnovers: 2,
    penalties: 8,
    penalty_yards: 65,
    time_of_possession: '28:35',
    third_down_conversions: '5/14',
    fourth_down_conversions: '0/1'
  }
];

// Sample player statistics
export const mockPlayerStats: PlayerStats[] = [
  {
    id: 1,
    game_id: 1,
    player_id: 1,
    team_id: 1,
    player_name: 'Josh Allen',
    position: 'QB',
    jersey_number: 17,
    team_name: 'Buffalo Bills',
    team_abbr: 'BUF',
    passing_yards: 275,
    passing_touchdowns: 2,
    rushing_yards: 45,
    rushing_touchdowns: 1
  },
  {
    id: 2,
    game_id: 1,
    player_id: 2,
    team_id: 2,
    player_name: 'Tua Tagovailoa',
    position: 'QB',
    jersey_number: 1,
    team_name: 'Miami Dolphins',
    team_abbr: 'MIA',
    passing_yards: 230,
    passing_touchdowns: 1,
    rushing_yards: 15,
    rushing_touchdowns: 0
  }
];