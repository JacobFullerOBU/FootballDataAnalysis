import React, { useState, useEffect, useCallback } from 'react';
import { gamesAPI } from '../services/api';
import { Game } from '../types';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'nfl' | 'college',
    status: 'all' as 'all' | 'scheduled' | 'completed' | 'in_progress',
    season: new Date().getFullYear(),
    week: Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
  });

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      let gamesList: Game[] = [];

      if (filters.status === 'scheduled') {
        gamesList = await gamesAPI.getUpcoming(50, filters.type === 'all' ? undefined : filters.type);
      } else if (filters.status === 'completed') {
        gamesList = await gamesAPI.getRecent(50, filters.type === 'all' ? undefined : filters.type);
      } else {
        // Get games for specific week
        gamesList = await gamesAPI.getByWeek(
          filters.season, 
          filters.week, 
          filters.type === 'all' ? undefined : filters.type
        );
      }

      // Filter by status if not 'all'
      if (filters.status !== 'all') {
        gamesList = gamesList.filter(game => game.status === filters.status);
      }

      setGames(gamesList);
    } catch (err) {
      setError('Failed to load games');
      console.error('Games error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Games</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="nfl">NFL</option>
              <option value="college">College</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
            <select
              value={filters.season}
              onChange={(e) => handleFilterChange('season', parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
            <select
              value={filters.week}
              onChange={(e) => handleFilterChange('week', parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Games Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No games found with the current filters</p>
        </div>
      )}
    </div>
  );
};

export default Games;