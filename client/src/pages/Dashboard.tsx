import React, { useState, useEffect, useCallback } from 'react';
import { gamesAPI, statsAPI } from '../services/api';
import { Game, WeeklyAnalysis } from '../types';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [nflAnalysis, setNflAnalysis] = useState<WeeklyAnalysis | null>(null);
  const [collegeAnalysis, setCollegeAnalysis] = useState<WeeklyAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const currentSeason = currentDate.getFullYear();
      const currentWeek = Math.ceil(
        (currentDate.getTime() - new Date(currentSeason, 8, 1).getTime()) / 
        (7 * 24 * 60 * 60 * 1000)
      );

      const [recent, upcoming, nflWeekly, collegeWeekly] = await Promise.all([
        gamesAPI.getRecent(6),
        gamesAPI.getUpcoming(6),
        statsAPI.getWeeklyAnalysis(currentSeason, currentWeek, 'nfl').catch(() => null),
        statsAPI.getWeeklyAnalysis(currentSeason, currentWeek, 'college').catch(() => null),
      ]);

      setRecentGames(recent);
      setUpcomingGames(upcoming);
      setNflAnalysis(nflWeekly);
      setCollegeAnalysis(collegeWeekly);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Football Analytics Dashboard</h1>
        <p className="text-lg text-gray-600">
          Comprehensive analysis of NFL and College Football games, statistics, and betting lines
        </p>
      </div>

      {/* Weekly Analysis */}
      {(nflAnalysis || collegeAnalysis) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nflAnalysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-nfl-600 mb-4">NFL Week {nflAnalysis.week} Analysis</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Total Games:</span> {nflAnalysis.totalGames}</p>
                <p><span className="font-medium">Average Score:</span> {nflAnalysis.averageScore}</p>
                {nflAnalysis.highestScoringGame && (
                  <p><span className="font-medium">Highest Scoring:</span> {nflAnalysis.highestScoringGame.away_team_abbr} vs {nflAnalysis.highestScoringGame.home_team_abbr}</p>
                )}
              </div>
            </div>
          )}
          
          {collegeAnalysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-college-600 mb-4">College Week {collegeAnalysis.week} Analysis</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Total Games:</span> {collegeAnalysis.totalGames}</p>
                <p><span className="font-medium">Average Score:</span> {collegeAnalysis.averageScore}</p>
                {collegeAnalysis.highestScoringGame && (
                  <p><span className="font-medium">Highest Scoring:</span> {collegeAnalysis.highestScoringGame.away_team_abbr} vs {collegeAnalysis.highestScoringGame.home_team_abbr}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Games */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Games</h2>
        {recentGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No recent games found</p>
        )}
      </section>

      {/* Upcoming Games */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Games</h2>
        {upcomingGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No upcoming games found</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;