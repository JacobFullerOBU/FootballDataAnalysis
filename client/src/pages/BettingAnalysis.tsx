import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bettingAPI, gamesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Game, BettingLine } from '../types';
import {
  convertOdds,
  calculateVig,
  calculateEV,
  formatOdds,
  formatPercentage,
  getEVColorClass
} from '../utils/bettingUtils';

interface BettingAnalysisData {
  game: Game;
  lines: BettingLine[];
  analysis: any;
}

const BettingAnalysis: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [data, setData] = useState<BettingAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOddsFormat, setSelectedOddsFormat] = useState<'american' | 'decimal' | 'fractional'>('american');

  useEffect(() => {
    const fetchData = async () => {
      if (!gameId) return;
      
      try {
        setLoading(true);
        const [gameData, linesData, comparisonData] = await Promise.all([
          gamesAPI.getById(parseInt(gameId)),
          bettingAPI.getGameLines(parseInt(gameId)),
          bettingAPI.getLineComparison(parseInt(gameId))
        ]);

        setData({
          game: gameData,
          lines: linesData,
          analysis: comparisonData
        });
      } catch (err) {
        setError('Failed to load betting analysis data');
        console.error('Betting analysis error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!data) return <div className="text-gray-600 text-center py-8">No data available</div>;

  const { game, lines, analysis } = data;

  // Group lines by bookmaker and get latest
  const latestLines = lines.reduce((acc: any, line: any) => {
    if (!acc[line.bookmaker] || new Date(line.timestamp) > new Date(acc[line.bookmaker].timestamp)) {
      acc[line.bookmaker] = line;
    }
    return acc;
  }, {});

  const bookmakers = Object.values(latestLines) as BettingLine[];

  // Calculate consensus (average) odds
  const calculateConsensus = (type: 'moneyline_home' | 'moneyline_away' | 'point_spread' | 'over_under') => {
    const values = bookmakers
      .map(line => line[type])
      .filter(val => val !== null && val !== undefined) as number[];
    
    if (values.length === 0) return null;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const consensusHomeML = calculateConsensus('moneyline_home');
  const consensusAwayML = calculateConsensus('moneyline_away');
  const consensusSpread = calculateConsensus('point_spread');
  const consensusOU = calculateConsensus('over_under');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/betting" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Betting Lines
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Betting Analysis</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedOddsFormat('american')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              selectedOddsFormat === 'american' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            American
          </button>
          <button
            onClick={() => setSelectedOddsFormat('decimal')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              selectedOddsFormat === 'decimal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Decimal
          </button>
          <button
            onClick={() => setSelectedOddsFormat('fractional')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              selectedOddsFormat === 'fractional' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fractional
          </button>
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {game.away_team_abbr} @ {game.home_team_abbr}
            </h2>
            <p className="text-gray-600">
              {new Date(game.game_date).toLocaleDateString()} • Week {game.week} • {game.type?.toUpperCase()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded text-sm font-medium ${
            game.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
            game.status === 'in_progress' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {game.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Moneyline Analysis */}
      {consensusHomeML && consensusAwayML && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Moneyline Analysis</h3>
          
          {/* Consensus and Vig */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700">Market Consensus</h4>
              <div className="mt-2">
                <div className="flex justify-between">
                  <span>{game.home_team_abbr}:</span>
                  <span className="font-medium">{formatOdds(consensusHomeML, selectedOddsFormat)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{game.away_team_abbr}:</span>
                  <span className="font-medium">{formatOdds(consensusAwayML, selectedOddsFormat)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700">Implied Probabilities</h4>
              <div className="mt-2">
                <div className="flex justify-between">
                  <span>{game.home_team_abbr}:</span>
                  <span className="font-medium">{formatPercentage(convertOdds(consensusHomeML).impliedProbability * 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{game.away_team_abbr}:</span>
                  <span className="font-medium">{formatPercentage(convertOdds(consensusAwayML).impliedProbability * 100)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700">Market Vig</h4>
              <div className="mt-2">
                <span className="text-2xl font-bold">{formatPercentage(calculateVig(consensusHomeML, consensusAwayML))}</span>
              </div>
            </div>
          </div>

          {/* Bookmaker Comparison */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Bookmaker</th>
                  <th className="text-center py-2">{game.home_team_abbr}</th>
                  <th className="text-center py-2">Implied Prob</th>
                  <th className="text-center py-2">{game.away_team_abbr}</th>
                  <th className="text-center py-2">Implied Prob</th>
                  <th className="text-center py-2">Vig</th>
                </tr>
              </thead>
              <tbody>
                {bookmakers.map((line) => {
                  if (!line.moneyline_home || !line.moneyline_away) return null;
                  
                  const homeOdds = convertOdds(line.moneyline_home);
                  const awayOdds = convertOdds(line.moneyline_away);
                  const vig = calculateVig(line.moneyline_home, line.moneyline_away);
                  
                  return (
                    <tr key={line.bookmaker} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{line.bookmaker}</td>
                      <td className="text-center py-2">{formatOdds(line.moneyline_home, selectedOddsFormat)}</td>
                      <td className="text-center py-2">{formatPercentage(homeOdds.impliedProbability * 100)}</td>
                      <td className="text-center py-2">{formatOdds(line.moneyline_away, selectedOddsFormat)}</td>
                      <td className="text-center py-2">{formatPercentage(awayOdds.impliedProbability * 100)}</td>
                      <td className="text-center py-2">{formatPercentage(vig)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Point Spread Analysis */}
      {consensusSpread && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Point Spread Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Market Consensus</h4>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {game.home_team_abbr} {consensusSpread > 0 ? '+' : ''}{consensusSpread.toFixed(1)}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {consensusSpread > 0 ? 'Underdog' : 'Favorite'} by {Math.abs(consensusSpread).toFixed(1)} points
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Spread Range</h4>
              {analysis?.analysis?.spreadRange && (
                <div className="bg-gray-50 p-4 rounded">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Best Line:</span>
                      <span className="font-medium">{analysis.analysis.spreadRange.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Worst Line:</span>
                      <span className="font-medium">{analysis.analysis.spreadRange.max}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average:</span>
                      <span className="font-medium">{analysis.analysis.spreadRange.average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bookmaker Spread Comparison */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Bookmaker</th>
                  <th className="text-center py-2">Spread</th>
                  <th className="text-center py-2">Difference from Consensus</th>
                </tr>
              </thead>
              <tbody>
                {bookmakers.map((line) => {
                  if (line.point_spread === null || line.point_spread === undefined) return null;
                  
                  const diff = line.point_spread - consensusSpread;
                  
                  return (
                    <tr key={line.bookmaker} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{line.bookmaker}</td>
                      <td className="text-center py-2">
                        {game.home_team_abbr} {line.point_spread > 0 ? '+' : ''}{line.point_spread}
                      </td>
                      <td className="text-center py-2">
                        <span className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Over/Under Analysis */}
      {consensusOU && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Over/Under Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Market Consensus</h4>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-center">
                  <div className="text-2xl font-bold">{consensusOU.toFixed(1)}</div>
                  <div className="text-gray-600 mt-1">Total Points</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">O/U Range</h4>
              {analysis?.analysis?.overUnderRange && (
                <div className="bg-gray-50 p-4 rounded">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lowest:</span>
                      <span className="font-medium">{analysis.analysis.overUnderRange.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Highest:</span>
                      <span className="font-medium">{analysis.analysis.overUnderRange.max}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average:</span>
                      <span className="font-medium">{analysis.analysis.overUnderRange.average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bookmaker O/U Comparison */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Bookmaker</th>
                  <th className="text-center py-2">Over/Under</th>
                  <th className="text-center py-2">Difference from Consensus</th>
                </tr>
              </thead>
              <tbody>
                {bookmakers.map((line) => {
                  if (line.over_under === null || line.over_under === undefined) return null;
                  
                  const diff = line.over_under - consensusOU;
                  
                  return (
                    <tr key={line.bookmaker} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{line.bookmaker}</td>
                      <td className="text-center py-2">{line.over_under}</td>
                      <td className="text-center py-2">
                        <span className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Value Betting Opportunities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Value Analysis</h3>
        <div className="text-gray-600 text-sm mb-4">
          Value betting opportunities are calculated by comparing individual bookmaker odds to market consensus.
          Positive values indicate potential value bets.
        </div>
        
        <div className="space-y-4">
          {bookmakers.map((line) => (
            <div key={line.bookmaker} className="border border-gray-200 rounded p-4">
              <h4 className="font-medium mb-3">{line.bookmaker}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Moneyline Value */}
                {line.moneyline_home && line.moneyline_away && consensusHomeML && consensusAwayML && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Moneyline Value</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{game.home_team_abbr}:</span>
                        <span className={`text-sm px-2 py-1 rounded ${getEVColorClass(calculateEV(line.moneyline_home, consensusHomeML))}`}>
                          {calculateEV(line.moneyline_home, consensusHomeML).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{game.away_team_abbr}:</span>
                        <span className={`text-sm px-2 py-1 rounded ${getEVColorClass(calculateEV(line.moneyline_away, consensusAwayML))}`}>
                          {calculateEV(line.moneyline_away, consensusAwayML).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Spread Line Shopping */}
                {line.point_spread !== null && line.point_spread !== undefined && consensusSpread && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Spread Line Shopping</h5>
                    <div className="text-sm">
                      <div className="flex justify-between items-center">
                        <span>Your Line:</span>
                        <span className="font-medium">{line.point_spread > 0 ? '+' : ''}{line.point_spread}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Market:</span>
                        <span>{consensusSpread > 0 ? '+' : ''}{consensusSpread.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Advantage:</span>
                        <span className={`font-medium ${(line.point_spread - consensusSpread) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {((line.point_spread - consensusSpread) > 0 ? '+' : '')}{(line.point_spread - consensusSpread).toFixed(1)} pts
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* O/U Line Shopping */}
                {line.over_under !== null && line.over_under !== undefined && consensusOU && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">O/U Line Shopping</h5>
                    <div className="text-sm">
                      <div className="flex justify-between items-center">
                        <span>Your Line:</span>
                        <span className="font-medium">{line.over_under}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Market:</span>
                        <span>{consensusOU.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Advantage:</span>
                        <span className={`font-medium ${Math.abs(line.over_under - consensusOU) > 0.5 ? 'text-green-600' : 'text-gray-600'}`}>
                          {Math.abs(line.over_under - consensusOU).toFixed(1)} pts
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BettingAnalysis;