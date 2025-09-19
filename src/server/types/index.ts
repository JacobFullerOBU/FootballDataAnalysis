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
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  gameDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed';
  type: 'nfl' | 'college';
  venue?: string;
}

export interface PlayerStats {
  id: number;
  gameId: number;
  playerId: number;
  teamId: number;
  passingYards?: number;
  passingTouchdowns?: number;
  rushingYards?: number;
  rushingTouchdowns?: number;
  receivingYards?: number;
  receivingTouchdowns?: number;
  tackles?: number;
  sacks?: number;
  interceptions?: number;
}

export interface TeamStats {
  id: number;
  gameId: number;
  teamId: number;
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
  penalties: number;
  penaltyYards: number;
  timeOfPossession?: string;
  thirdDownConversions?: string;
  fourthDownConversions?: string;
}

export interface BettingLine {
  id: number;
  gameId: number;
  bookmaker: string;
  pointSpread?: number;
  overUnder?: number;
  moneylineHome?: number;
  moneylineAway?: number;
  timestamp: Date;
}

export interface WeeklyAnalysis {
  week: number;
  season: number;
  type: 'nfl' | 'college';
  totalGames: number;
  averageScore: number;
  highestScoringGame: Game;
  upsets: Game[];
  trendingStats: {
    topRushers: PlayerStats[];
    topPassers: PlayerStats[];
    topReceivers: PlayerStats[];
  };
}