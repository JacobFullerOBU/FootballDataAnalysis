# Football Data Analysis - Demo Documentation

## Overview
This demo showcases a comprehensive web application for analyzing NFL and college football games, statistics, and betting lines. The application includes sample data to demonstrate all features.

## Demo Features

### 🏈 Sample Data Included
- **34 Teams Total**:
  - 20 NFL teams from all major divisions (AFC/NFC East, North, South, West)
  - 14 college teams from major conferences (SEC, Big Ten, Big 12)
- **10 Sample Games**:
  - 6 upcoming games (3 NFL, 3 college)
  - 4 completed games with scores (2 NFL, 2 college)
- **Betting Lines**:
  - Multiple bookmakers (DraftKings, FanDuel, BetMGM, Caesars)
  - Point spreads, over/under totals, moneylines
  - Realistic odds variations between books

### 📊 Application Features

#### Dashboard
- Overview of recent and upcoming games
- Weekly analysis summary
- Key statistics at a glance

#### Games Management
- View upcoming games with schedules
- Browse completed games with scores
- Filter by league type (NFL/College)
- Detailed game information including venues

#### Teams Directory
- Complete roster of NFL and college teams
- Conference and division organization
- Team-specific game history
- Filtering capabilities

#### Betting Analysis
- Compare odds across multiple bookmakers
- Point spread and over/under analysis
- Moneyline comparisons
- Betting trends and insights

#### Statistics & Analytics
- Team performance metrics
- Season-long statistical analysis
- Weekly performance breakdowns
- Advanced analytics dashboard

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm (comes with Node.js)

### Setup
1. **Clone and setup the demo**:
   ```bash
   git clone https://github.com/JacobFullerOBU/FootballDataAnalysis.git
   cd FootballDataAnalysis
   ./setup-demo.sh
   ```

2. **Start the application**:
   ```bash
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Documentation

### Health Check
```bash
GET /api/health
```
Returns server status and version information.

### Teams
```bash
# Get all teams
GET /api/teams

# Get NFL teams only
GET /api/teams?type=nfl

# Get college teams only
GET /api/teams?type=college

# Get specific team
GET /api/teams/:id

# Get team's recent games
GET /api/teams/:id/games/recent/:limit

# Get team's upcoming games
GET /api/teams/:id/games/upcoming/:limit
```

### Games
```bash
# Get upcoming games
GET /api/games/upcoming/:limit

# Get recent completed games
GET /api/games/recent/:limit

# Get games for specific week/season
GET /api/games/week/:season/:week

# Get specific game
GET /api/games/:id
```

### Betting Lines
```bash
# Get betting lines for a game
GET /api/betting/game/:gameId

# Get upcoming games with betting lines
GET /api/betting/upcoming/:type?limit=10

# Compare betting lines
GET /api/betting/compare/:gameId

# Get betting trends for a team
GET /api/betting/trends/team/:teamId/:season
```

### Statistics
```bash
# Get team stats for a game
GET /api/stats/team/:gameId/:teamId

# Get all stats for a game
GET /api/stats/game/:gameId

# Get player stats for a game
GET /api/stats/players/:gameId

# Get season statistics
GET /api/stats/season/:season/:type

# Get weekly analysis
GET /api/stats/weekly/:season/:week/:type
```

## Sample Data Examples

### NFL Teams (20 teams)
- AFC: Bills, Dolphins, Patriots, Jets, Ravens, Bengals, Browns, Steelers, Texans, Colts, Jaguars, Titans, Broncos, Chiefs, Raiders, Chargers
- NFC: Cowboys, Giants, Eagles, Commanders

### College Teams (14 teams)
- SEC: Alabama, Georgia, LSU, Florida, Auburn, Tennessee
- Big Ten: Ohio State, Michigan, Penn State, Wisconsin
- Big 12: Texas, Oklahoma, Oklahoma State, Baylor

### Sample Games
**Upcoming Games:**
- Bills vs Dolphins (NFL)
- Chiefs vs Raiders (NFL)
- Cowboys vs Eagles (NFL)
- Alabama vs Georgia (College)
- Ohio State vs Michigan (College)
- Texas vs Oklahoma (College)

**Completed Games:**
- Ravens 24 - 17 Bengals (NFL)
- Jets 21 - 14 Patriots (NFL)
- LSU 31 - 28 Auburn (College)
- Penn State 28 - 14 Wisconsin (College)

### Betting Lines Examples
Each game includes lines from multiple bookmakers:
- **DraftKings**: Point spreads, totals, moneylines
- **FanDuel**: Slightly different odds for comparison
- **BetMGM/Caesars**: Additional market variations

## Technical Stack

### Backend
- Node.js with Express.js
- TypeScript for type safety
- SQLite database
- Automated data population
- RESTful API design
- Error handling and logging

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API communication
- Responsive CSS design
- Component-based architecture

## Development Notes

### Database Schema
- `teams`: Team information and metadata
- `games`: Game schedules, scores, and status
- `betting_lines`: Odds and lines from multiple bookmakers
- `players`: Player information (ready for expansion)
- `player_stats`: Individual player statistics (ready for expansion)
- `team_stats`: Team game statistics (ready for expansion)

### Data Management
- Automatic sample data generation on startup
- Scheduled data updates (configurable)
- Data validation and error handling
- Support for both NFL and college football

### Extensibility
The application is designed to be easily extended with:
- Real API integrations (ESPN, The Odds API, Sports Radar)
- Additional statistics and metrics
- More betting markets and bookmakers
- Player-level statistics
- Advanced analytics features

## Demo Scenarios

### 1. Browse Teams
1. Navigate to Teams page
2. Filter by NFL or College
3. View team details and recent games

### 2. Check Upcoming Games
1. Visit Dashboard or Games page
2. View upcoming games with venues and times
3. See betting lines for each game

### 3. Analyze Betting Lines
1. Go to Betting section
2. Compare odds across bookmakers
3. View spread and total variations

### 4. Review Game Results
1. Check recent games with scores
2. Analyze team performance
3. Review statistical summaries

## Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in .env file
2. **Build failures**: Ensure Node.js v16+ is installed
3. **Database issues**: Delete data folder and restart to reset

### Support
For issues or questions about the demo:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure ports 3000 and 3001 are available

## Next Steps

This demo provides a foundation for:
- Integrating with real sports data APIs
- Adding user authentication and preferences
- Implementing advanced analytics
- Creating betting strategy tools
- Adding real-time updates
- Mobile application development

The modular architecture makes it easy to extend functionality while maintaining clean separation of concerns.