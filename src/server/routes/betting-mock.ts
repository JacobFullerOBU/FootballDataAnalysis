// Temporary mock API for betting data to demonstrate the analysis feature
import express from 'express';

const router = express.Router();

// Mock upcoming games with betting lines
router.get('/mock-upcoming', async (req, res) => {
  try {
    const mockGames = [
      {
        game_id: 1,
        game_date: '2025-09-21T20:00:00Z',
        week: 3,
        season: 2025,
        type: 'nfl',
        home_team_name: 'Buffalo Bills',
        home_team_abbr: 'BUF',
        away_team_name: 'Baltimore Ravens',
        away_team_abbr: 'BAL',
        bettingLines: [
          {
            bookmaker: 'DraftKings',
            point_spread: -3.5,
            over_under: 47.5,
            moneyline_home: -180,
            moneyline_away: 150,
            timestamp: '2025-09-19T16:00:00Z'
          },
          {
            bookmaker: 'FanDuel',
            point_spread: -3.0,
            over_under: 48.0,
            moneyline_home: -175,
            moneyline_away: 145,
            timestamp: '2025-09-19T16:00:00Z'
          },
          {
            bookmaker: 'BetMGM',
            point_spread: -3.5,
            over_under: 47.0,
            moneyline_home: -185,
            moneyline_away: 155,
            timestamp: '2025-09-19T16:00:00Z'
          },
          {
            bookmaker: 'Caesars',
            point_spread: -2.5,
            over_under: 48.5,
            moneyline_home: -165,
            moneyline_away: 140,
            timestamp: '2025-09-19T16:00:00Z'
          }
        ]
      },
      {
        game_id: 2,
        game_date: '2025-09-22T19:00:00Z',
        week: 4,
        season: 2025,
        type: 'college',
        home_team_name: 'Alabama Crimson Tide',
        home_team_abbr: 'ALA',
        away_team_name: 'Georgia Bulldogs',
        away_team_abbr: 'UGA',
        bettingLines: [
          {
            bookmaker: 'DraftKings',
            point_spread: 7.5,
            over_under: 52.5,
            moneyline_home: 250,
            moneyline_away: -300,
            timestamp: '2025-09-19T16:00:00Z'
          },
          {
            bookmaker: 'FanDuel',
            point_spread: 7.0,
            over_under: 53.0,
            moneyline_home: 240,
            moneyline_away: -290,
            timestamp: '2025-09-19T16:00:00Z'
          },
          {
            bookmaker: 'BetMGM',
            point_spread: 6.5,
            over_under: 52.0,
            moneyline_home: 220,
            moneyline_away: -275,
            timestamp: '2025-09-19T16:00:00Z'
          }
        ]
      },
      {
        game_id: 3,
        game_date: '2025-09-23T13:00:00Z',
        week: 3,
        season: 2025,
        type: 'nfl',
        home_team_name: 'Kansas City Chiefs',
        home_team_abbr: 'KC',
        away_team_name: 'Las Vegas Raiders',
        away_team_abbr: 'LV',
        bettingLines: [
          {
            bookmaker: 'DraftKings',
            point_spread: -10.5,
            over_under: 44.5,
            moneyline_home: -450,
            moneyline_away: 350,
            timestamp: '2025-09-19T16:00:00Z'
          },
          {
            bookmaker: 'FanDuel',
            point_spread: -11.0,
            over_under: 45.0,
            moneyline_home: -460,
            moneyline_away: 360,
            timestamp: '2025-09-19T16:00:00Z'
          }
        ]
      }
    ];

    res.json(mockGames);
  } catch (error) {
    console.error('Mock upcoming error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock game details
router.get('/mock-game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const mockGame = {
      id: parseInt(gameId),
      week: 3,
      season: 2025,
      home_team_id: 1,
      away_team_id: 2,
      game_date: '2025-09-21T20:00:00Z',
      status: 'scheduled',
      type: 'nfl',
      home_team_name: 'Buffalo Bills',
      home_team_abbr: 'BUF',
      away_team_name: 'Baltimore Ravens',
      away_team_abbr: 'BAL'
    };

    res.json(mockGame);
  } catch (error) {
    console.error('Mock game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock betting lines for a game
router.get('/mock-lines/:gameId', async (req, res) => {
  try {
    const mockLines = [
      {
        id: 1,
        game_id: parseInt(req.params.gameId),
        bookmaker: 'DraftKings',
        point_spread: -3.5,
        over_under: 47.5,
        moneyline_home: -180,
        moneyline_away: 150,
        timestamp: '2025-09-19T16:00:00Z'
      },
      {
        id: 2,
        game_id: parseInt(req.params.gameId),
        bookmaker: 'FanDuel',
        point_spread: -3.0,
        over_under: 48.0,
        moneyline_home: -175,
        moneyline_away: 145,
        timestamp: '2025-09-19T16:00:00Z'
      },
      {
        id: 3,
        game_id: parseInt(req.params.gameId),
        bookmaker: 'BetMGM',
        point_spread: -3.5,
        over_under: 47.0,
        moneyline_home: -185,
        moneyline_away: 155,
        timestamp: '2025-09-19T16:00:00Z'
      },
      {
        id: 4,
        game_id: parseInt(req.params.gameId),
        bookmaker: 'Caesars',
        point_spread: -2.5,
        over_under: 48.5,
        moneyline_home: -165,
        moneyline_away: 140,
        timestamp: '2025-09-19T16:00:00Z'
      }
    ];

    res.json(mockLines);
  } catch (error) {
    console.error('Mock lines error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock line comparison
router.get('/mock-compare/:gameId', async (req, res) => {
  try {
    const mockComparison = {
      gameId: parseInt(req.params.gameId),
      bookmakers: [
        {
          bookmaker: 'DraftKings',
          point_spread: -3.5,
          over_under: 47.5,
          moneyline_home: -180,
          moneyline_away: 150,
          timestamp: '2025-09-19T16:00:00Z'
        },
        {
          bookmaker: 'FanDuel',
          point_spread: -3.0,
          over_under: 48.0,
          moneyline_home: -175,
          moneyline_away: 145,
          timestamp: '2025-09-19T16:00:00Z'
        },
        {
          bookmaker: 'BetMGM',
          point_spread: -3.5,
          over_under: 47.0,
          moneyline_home: -185,
          moneyline_away: 155,
          timestamp: '2025-09-19T16:00:00Z'
        },
        {
          bookmaker: 'Caesars',
          point_spread: -2.5,
          over_under: 48.5,
          moneyline_home: -165,
          moneyline_away: 140,
          timestamp: '2025-09-19T16:00:00Z'
        }
      ],
      analysis: {
        spreadRange: {
          min: -3.5,
          max: -2.5,
          average: -3.125
        },
        overUnderRange: {
          min: 47.0,
          max: 48.5,
          average: 47.75
        }
      }
    };

    res.json(mockComparison);
  } catch (error) {
    console.error('Mock comparison error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;