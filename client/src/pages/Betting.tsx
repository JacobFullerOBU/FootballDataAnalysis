import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bettingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Betting: React.FC = () => {
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'nfl' | 'college'>('all');

  const fetchBettingData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bettingAPI.getUpcomingLines(filterType, 20);
      setUpcomingGames(data as any[]);
    } catch (err) {
      setError('Failed to load betting data');
      console.error('Betting error:', err);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchBettingData();
  }, [fetchBettingData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Betting Lines</h1>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-md font-medium ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setFilterType('nfl')}
            className={`px-4 py-2 rounded-md font-medium ${
              filterType === 'nfl'
                ? 'bg-nfl-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            NFL
          </button>
          <button
            onClick={() => setFilterType('college')}
            className={`px-4 py-2 rounded-md font-medium ${
              filterType === 'college'
                ? 'bg-college-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            College
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Betting Lines */}
      {upcomingGames && upcomingGames.length > 0 ? (
        <div className="space-y-4">
          {upcomingGames.map((game: any) => (
            <div key={game.game_id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {game.away_team_abbr} @ {game.home_team_abbr}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(game.game_date).toLocaleDateString()} • Week {game.week}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/betting/analysis/${game.game_id}`}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Analyze
                  </Link>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    game.type === 'nfl' 
                      ? 'bg-nfl-100 text-nfl-800' 
                      : 'bg-college-100 text-college-800'
                  }`}>
                    {game.type?.toUpperCase()}
                  </div>
                </div>
              </div>

              {game.bettingLines && game.bettingLines.length > 0 ? (
                <div className="space-y-3">
                  {game.bettingLines.map((line: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="font-medium">{line.bookmaker}</div>
                      <div className="flex space-x-6 text-sm">
                        {line.point_spread && (
                          <div className="text-center">
                            <div className="text-gray-600">Spread</div>
                            <div className="font-medium">{line.point_spread > 0 ? '+' : ''}{line.point_spread}</div>
                          </div>
                        )}
                        {line.over_under && (
                          <div className="text-center">
                            <div className="text-gray-600">O/U</div>
                            <div className="font-medium">{line.over_under}</div>
                          </div>
                        )}
                        {(line.moneyline_home || line.moneyline_away) && (
                          <div className="text-center">
                            <div className="text-gray-600">Moneyline</div>
                            <div className="font-medium">
                              {line.moneyline_home && `${line.moneyline_home > 0 ? '+' : ''}${line.moneyline_home}`}
                              {line.moneyline_home && line.moneyline_away && ' / '}
                              {line.moneyline_away && `${line.moneyline_away > 0 ? '+' : ''}${line.moneyline_away}`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No betting lines available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No upcoming games with betting lines found</p>
        </div>
      )}
    </div>
  );
};

export default Betting;