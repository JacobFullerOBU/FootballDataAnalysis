// Static implementation using mock data instead of HTTP API calls
// This allows the application to run without a backend server
import { 
  teamsAPI as mockTeamsAPI,
  gamesAPI as mockGamesAPI,
  statsAPI as mockStatsAPI,
  bettingAPI as mockBettingAPI,
  healthAPI as mockHealthAPI
} from './mockApi';

// Re-export the mock APIs with the same interface as the original API
export const teamsAPI = mockTeamsAPI;
export const gamesAPI = mockGamesAPI;
export const statsAPI = mockStatsAPI;
export const bettingAPI = mockBettingAPI;
export const healthAPI = mockHealthAPI;

// Mock api instance for compatibility
const api = {
  get: async (url: string, config?: any) => {
    // This is a placeholder that matches the axios interface
    // but doesn't actually make HTTP requests
    return { data: {} };
  }
};

export default api;