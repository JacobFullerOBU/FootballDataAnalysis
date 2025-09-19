import React, { useState, useEffect, useCallback } from 'react';
import { teamsAPI } from '../services/api';
import { Team } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'nfl' | 'college'>('all');

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const teamsList = await teamsAPI.getAll(filterType === 'all' ? undefined : filterType);
      setTeams(teamsList);
    } catch (err) {
      setError('Failed to load teams');
      console.error('Teams error:', err);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
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
            All Teams
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

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{team.abbreviation}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{team.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      team.type === 'nfl' 
                        ? 'bg-nfl-100 text-nfl-800' 
                        : 'bg-college-100 text-college-800'
                    }`}>
                      {team.type.toUpperCase()}
                    </span>
                    {team.conference && (
                      <span className="text-sm text-gray-600">{team.conference}</span>
                    )}
                  </div>
                  {team.division && (
                    <p className="text-sm text-gray-500 mt-1">{team.division}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No teams found</p>
        </div>
      )}
    </div>
  );
};

export default Teams;