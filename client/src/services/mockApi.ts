import { Team, Game, BettingLine, WeeklyAnalysis, PlayerStats, TeamStats } from '../types';
import { 
  mockTeams, 
  mockGames, 
  mockBettingLines, 
  mockWeeklyAnalysis, 
  mockTeamStats, 
  mockPlayerStats 
} from './mockData';

// Simulate API delay for realism
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Teams API Mock
export const teamsAPI = {
  getAll: async (type?: 'nfl' | 'college'): Promise<Team[]> => {
    await delay();
    if (type) {
      return mockTeams.filter(team => team.type === type);
    }
    return mockTeams;
  },
  
  getById: async (id: number): Promise<Team> => {
    await delay();
    const team = mockTeams.find(t => t.id === id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }
    return team;
  },
  
  getRecentGames: async (id: number, limit: number = 10): Promise<Game[]> => {
    await delay();
    return mockGames
      .filter(game => 
        (game.home_team_id === id || game.away_team_id === id) && 
        game.status === 'completed'
      )
      .sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime())
      .slice(0, limit);
  },
  
  getUpcomingGames: async (id: number, limit: number = 10): Promise<Game[]> => {
    await delay();
    return mockGames
      .filter(game => 
        (game.home_team_id === id || game.away_team_id === id) && 
        game.status === 'scheduled'
      )
      .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime())
      .slice(0, limit);
  },
};

// Games API Mock
export const gamesAPI = {
  getByWeek: async (season: number, week: number, type?: 'nfl' | 'college'): Promise<Game[]> => {
    await delay();
    return mockGames.filter(game => {
      const matchesSeason = game.season === season;
      const matchesWeek = game.week === week;
      const matchesType = !type || game.type === type;
      return matchesSeason && matchesWeek && matchesType;
    });
  },
  
  getById: async (id: number): Promise<Game> => {
    await delay();
    const game = mockGames.find(g => g.id === id);
    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }
    return game;
  },
  
  getRecent: async (limit: number = 10, type?: 'nfl' | 'college'): Promise<Game[]> => {
    await delay();
    return mockGames
      .filter(game => {
        const matchesType = !type || game.type === type;
        const isCompleted = game.status === 'completed';
        return matchesType && isCompleted;
      })
      .sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime())
      .slice(0, limit);
  },
  
  getUpcoming: async (limit: number = 10, type?: 'nfl' | 'college'): Promise<Game[]> => {
    await delay();
    return mockGames
      .filter(game => {
        const matchesType = !type || game.type === type;
        const isScheduled = game.status === 'scheduled';
        return matchesType && isScheduled;
      })
      .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime())
      .slice(0, limit);
  },
};

// Stats API Mock
export const statsAPI = {
  getTeamStats: async (gameId: number, teamId: number): Promise<TeamStats> => {
    await delay();
    const stats = mockTeamStats.find(s => s.game_id === gameId && s.team_id === teamId);
    if (!stats) {
      throw new Error(`Team stats for game ${gameId} and team ${teamId} not found`);
    }
    return stats;
  },
  
  getGameStats: async (gameId: number): Promise<TeamStats[]> => {
    await delay();
    return mockTeamStats.filter(s => s.game_id === gameId);
  },
  
  getPlayerStats: async (gameId: number, teamId?: number): Promise<PlayerStats[]> => {
    await delay();
    return mockPlayerStats.filter(s => {
      const matchesGame = s.game_id === gameId;
      const matchesTeam = !teamId || s.team_id === teamId;
      return matchesGame && matchesTeam;
    });
  },
  
  getSeasonStats: async (season: number, type: 'nfl' | 'college') => {
    await delay();
    // Return aggregated stats for the season
    const seasonGames = mockGames.filter(g => g.season === season && g.type === type);
    return {
      season,
      type,
      totalGames: seasonGames.length,
      completedGames: seasonGames.filter(g => g.status === 'completed').length,
      averageScore: seasonGames
        .filter(g => g.home_score && g.away_score)
        .reduce((sum, g) => sum + (g.home_score! + g.away_score!), 0) / 
        (seasonGames.filter(g => g.home_score && g.away_score).length * 2)
    };
  },
  
  getWeeklyAnalysis: async (season: number, week: number, type: 'nfl' | 'college'): Promise<WeeklyAnalysis> => {
    await delay();
    if (type === 'nfl') {
      return mockWeeklyAnalysis.nfl;
    } else {
      return mockWeeklyAnalysis.college;
    }
  },
};

// Betting API Mock
export const bettingAPI = {
  getGameLines: async (gameId: number): Promise<BettingLine[]> => {
    await delay();
    return mockBettingLines.filter(line => line.game_id === gameId);
  },
  
  getUpcomingLines: async (type?: 'nfl' | 'college' | 'all', limit?: number) => {
    await delay();
    const upcomingGames = mockGames.filter(g => g.status === 'scheduled');
    const filteredGames = type && type !== 'all' 
      ? upcomingGames.filter(g => g.type === type)
      : upcomingGames;
    
    const gamesWithLines = filteredGames
      .map(game => ({
        ...game,
        game_id: game.id, // Add game_id for consistency
        bettingLines: mockBettingLines.filter(line => line.game_id === game.id) // Match expected property name
      }))
      .filter(game => game.bettingLines.length > 0);
    
    return limit ? gamesWithLines.slice(0, limit) : gamesWithLines;
  },
  
  getLineComparison: async (gameId: number) => {
    await delay();
    const lines = mockBettingLines.filter(line => line.game_id === gameId);
    const game = mockGames.find(g => g.id === gameId);
    
    return {
      game,
      lines,
      bestSpread: lines.reduce((best, line) => 
        !best || Math.abs(line.point_spread || 0) < Math.abs(best.point_spread || 0) ? line : best
      ),
      bestOverUnder: lines.reduce((best, line) => 
        !best || (line.over_under || 0) > (best.over_under || 0) ? line : best
      )
    };
  },
  
  getTeamTrends: async (teamId: number, season: number) => {
    await delay();
    const teamGames = mockGames.filter(g => 
      (g.home_team_id === teamId || g.away_team_id === teamId) && 
      g.season === season && 
      g.status === 'completed'
    );
    
    const trends = teamGames.map(game => {
      const isHome = game.home_team_id === teamId;
      const teamScore = isHome ? game.home_score : game.away_score;
      const opponentScore = isHome ? game.away_score : game.home_score;
      const scoreDiff = (teamScore || 0) - (opponentScore || 0);
      
      return {
        week: game.week,
        teamScore,
        opponentScore,
        totalScore: (teamScore || 0) + (opponentScore || 0),
        scoreDiff,
        teamLocation: isHome ? 'home' : 'away',
        result: scoreDiff > 0 ? 'win' : 'loss'
      };
    });
    
    return {
      teamId,
      season,
      games: trends,
      record: {
        wins: trends.filter(t => t.result === 'win').length,
        losses: trends.filter(t => t.result === 'loss').length
      }
    };
  },
};

// Health check mock
export const healthAPI = {
  check: async () => {
    await delay(100);
    return { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'static' 
    };
  },
};

// Create a default export that mimics the axios instance
const mockApi = {
  get: async (url: string, config?: any) => {
    // This would normally make HTTP requests, but we'll just return mock data
    await delay();
    return { data: {} };
  }
};

export default mockApi;