import React, { useState, useEffect, useCallback } from 'react';
import { statsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics: React.FC = () => {
  const [seasonData, setSeasonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'nfl' | 'college'>('nfl');
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear());

  const fetchSeasonData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statsAPI.getSeasonStats(selectedSeason, selectedType);
      setSeasonData(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedSeason]);

  useEffect(() => {
    fetchSeasonData();
  }, [fetchSeasonData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'nfl' | 'college')}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="nfl">NFL</option>
              <option value="college">College</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Analytics Content */}
      {seasonData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Rushing Teams */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rushing Teams</h3>
            {seasonData.topRushingTeams && seasonData.topRushingTeams.length > 0 ? (
              <div className="space-y-3">
                {seasonData.topRushingTeams.slice(0, 5).map((team: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{team.team_name}</span>
                    <span className="text-gray-600">{Math.round(team.avg_rushing_yards)} ypg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No rushing data available</p>
            )}
          </div>

          {/* Top Passing Teams */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Passing Teams</h3>
            {seasonData.topPassingTeams && seasonData.topPassingTeams.length > 0 ? (
              <div className="space-y-3">
                {seasonData.topPassingTeams.slice(0, 5).map((team: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{team.team_name}</span>
                    <span className="text-gray-600">{Math.round(team.avg_passing_yards)} ypg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No passing data available</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No analytics data available for {selectedType.toUpperCase()} {selectedSeason}</p>
        </div>
      )}

      {/* Placeholder for Charts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Trends</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">Charts and visualizations will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;