import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const isCompleted = game.status === 'completed';
  const gameDate = new Date(game.game_date);
  
  return (
    <div className="game-card">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          game.type === 'nfl' 
            ? 'bg-nfl-100 text-nfl-800' 
            : 'bg-college-100 text-college-800'
        }`}>
          {game.type.toUpperCase()}
        </div>
        <div className="text-sm text-gray-500">
          Week {game.week} • {game.season}
        </div>
      </div>

      <div className="space-y-4">
        {/* Teams and Scores */}
        <div className="space-y-3">
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">{game.away_team_abbr}</span>
              </div>
              <span className="font-medium">{game.away_team_name}</span>
            </div>
            {isCompleted && (
              <span className="score">{game.away_score}</span>
            )}
          </div>

          <div className="text-center text-gray-400 text-sm">vs</div>

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">{game.home_team_abbr}</span>
              </div>
              <span className="font-medium">{game.home_team_name}</span>
            </div>
            {isCompleted && (
              <span className="score">{game.home_score}</span>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${
              game.status === 'completed' ? 'text-green-600' :
              game.status === 'in_progress' ? 'text-blue-600' :
              game.status === 'postponed' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {game.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span>{gameDate.toLocaleDateString()} {gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          {game.venue && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Venue:</span>
              <span className="text-right">{game.venue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;