import axios from 'axios';
import { Team, Game, BettingLine, WeeklyAnalysis, PlayerStats, TeamStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Teams API
export const teamsAPI = {
  getAll: async (type?: 'nfl' | 'college'): Promise<Team[]> => {
    const response = await api.get('/teams', { params: { type } });
    return response.data as Team[];
  },
  
  getById: async (id: number): Promise<Team> => {
    const response = await api.get(`/teams/${id}`);
    return response.data as Team;
  },
  
  getRecentGames: async (id: number, limit?: number): Promise<Game[]> => {
    const response = await api.get(`/teams/${id}/games/recent/${limit || 10}`);
    return response.data as Game[];
  },
  
  getUpcomingGames: async (id: number, limit?: number): Promise<Game[]> => {
    const response = await api.get(`/teams/${id}/games/upcoming/${limit || 10}`);
    return response.data as Game[];
  },
};

// Games API
export const gamesAPI = {
  getByWeek: async (season: number, week: number, type?: 'nfl' | 'college'): Promise<Game[]> => {
    const response = await api.get(`/games/week/${season}/${week}`, { params: { type } });
    return response.data as Game[];
  },
  
  getById: async (id: number): Promise<Game> => {
    const response = await api.get(`/betting-mock/mock-game/${id}`);
    return response.data as Game;
  },
  
  getRecent: async (limit?: number, type?: 'nfl' | 'college'): Promise<Game[]> => {
    const response = await api.get(`/games/recent/${limit || 10}`, { params: { type } });
    return response.data as Game[];
  },
  
  getUpcoming: async (limit?: number, type?: 'nfl' | 'college'): Promise<Game[]> => {
    const response = await api.get(`/games/upcoming/${limit || 10}`, { params: { type } });
    return response.data as Game[];
  },
};

// Stats API
export const statsAPI = {
  getTeamStats: async (gameId: number, teamId: number): Promise<TeamStats> => {
    const response = await api.get(`/stats/team/${gameId}/${teamId}`);
    return response.data as TeamStats;
  },
  
  getGameStats: async (gameId: number): Promise<TeamStats[]> => {
    const response = await api.get(`/stats/game/${gameId}`);
    return response.data as TeamStats[];
  },
  
  getPlayerStats: async (gameId: number, teamId?: number): Promise<PlayerStats[]> => {
    const response = await api.get(`/stats/players/${gameId}`, { params: { teamId } });
    return response.data as PlayerStats[];
  },
  
  getSeasonStats: async (season: number, type: 'nfl' | 'college') => {
    const response = await api.get(`/stats/season/${season}/${type}`);
    return response.data;
  },
  
  getWeeklyAnalysis: async (season: number, week: number, type: 'nfl' | 'college'): Promise<WeeklyAnalysis> => {
    const response = await api.get(`/stats/weekly/${season}/${week}/${type}`);
    return response.data as WeeklyAnalysis;
  },
};

// Betting API
export const bettingAPI = {
  getGameLines: async (gameId: number): Promise<BettingLine[]> => {
    const response = await api.get(`/betting-mock/mock-lines/${gameId}`);
    return response.data as BettingLine[];
  },
  
  getUpcomingLines: async (type?: 'nfl' | 'college' | 'all', limit?: number) => {
    const response = await api.get(`/betting-mock/mock-upcoming`);
    return response.data;
  },
  
  getLineComparison: async (gameId: number) => {
    const response = await api.get(`/betting-mock/mock-compare/${gameId}`);
    return response.data;
  },
  
  getTeamTrends: async (teamId: number, season: number) => {
    const response = await api.get(`/betting/trends/team/${teamId}/${season}`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;