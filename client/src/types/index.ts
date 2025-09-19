export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  conference?: string;
  division?: string;
  logo?: string;
  color?: string;
  type: 'nfl' | 'college';
}

export interface Game {
  id: number;
  week: number;
  season: number;
  home_team_id: number;
  away_team_id: number;
  home_score?: number;
  away_score?: number;
  game_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed';
  type: 'nfl' | 'college';
  venue?: string;
  home_team_name?: string;
  home_team_abbr?: string;
  away_team_name?: string;
  away_team_abbr?: string;
}

export interface BettingLine {
  id: number;
  game_id: number;
  bookmaker: string;
  point_spread?: number;
  over_under?: number;
  moneyline_home?: number;
  moneyline_away?: number;
  timestamp: string;
}

export interface WeeklyAnalysis {
  season: number;
  week: number;
  type: 'nfl' | 'college';
  totalGames: number;
  averageScore: number;
  highestScoringGame: Game;
  games: Game[];
}

export interface PlayerStats {
  id: number;
  game_id: number;
  player_id: number;
  team_id: number;
  player_name?: string;
  position?: string;
  jersey_number?: number;
  team_name?: string;
  team_abbr?: string;
  passing_yards?: number;
  passing_touchdowns?: number;
  rushing_yards?: number;
  rushing_touchdowns?: number;
  receiving_yards?: number;
  receiving_touchdowns?: number;
  tackles?: number;
  sacks?: number;
  interceptions?: number;
}

export interface TeamStats {
  id: number;
  game_id: number;
  team_id: number;
  team_name?: string;
  team_abbr?: string;
  total_yards: number;
  passing_yards: number;
  rushing_yards: number;
  turnovers: number;
  penalties: number;
  penalty_yards: number;
  time_of_possession?: string;
  third_down_conversions?: string;
  fourth_down_conversions?: string;
}