# FootballDataAnalysis

A comprehensive web application for analyzing weekly NFL and college football games scores, statistics, and betting lines.

## Deployment Options

### 🚀 Quick Start: Static Web Page (No Backend Required)

For the easiest deployment without any server setup, use the static version:

1. **Build the static application:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy the `build` folder** to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

   Or test locally:
   ```bash
   npx serve -s build
   ```

✅ **All features work with realistic mock data!** See [STATIC_DEPLOYMENT.md](STATIC_DEPLOYMENT.md) for detailed instructions.

### 🛠️ NPM-Free Alternatives

**Don't want to use npm?** We have several alternatives:

- **Static Build Script**: `./static-build.sh` - Creates standalone HTML/JS with no dependencies
- **Yarn Alternative**: `./yarn-setup.sh` - Drop-in replacement for npm  
- **Python Backend**: `./python-setup.sh` - Flask-based backend alternative
- **Multiple Options**: See [NPM_ALTERNATIVES.md](NPM_ALTERNATIVES.md) for all options

### 🔧 Full Development Setup (With Backend)

For development or custom data integration, follow the full setup instructions below.
=======
## 🎯 Demo Available!

**Try the demo with sample data right now!**

```bash
git clone https://github.com/JacobFullerOBU/FootballDataAnalysis.git
cd FootballDataAnalysis
./setup-demo.sh
npm start
```

The demo includes:
- 34 teams (20 NFL + 14 college)
- 10 sample games (upcoming and completed)
- Betting lines from multiple bookmakers
- Complete API endpoints

See [DEMO.md](DEMO.md) for detailed demo documentation.

## Features

- **Dashboard**: Overview of recent and upcoming games with weekly analysis
- **Games**: Detailed game schedules, scores, and results with filtering
- **Teams**: Team profiles and information for NFL and college teams
- **Analytics**: Statistical analysis and trends for teams and players
- **Betting**: Betting lines comparison from multiple bookmakers

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for type safety
- **SQLite** database for data storage
- **Automated data fetching** with scheduled jobs
- **RESTful API** design

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Mock API** for static deployment (or Axios for backend communication)
- **Responsive design** with custom CSS
- **Modern UI** components

## Getting Started (Full Development Setup)

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

**💡 Want alternatives to npm?** Check [NPM_ALTERNATIVES.md](NPM_ALTERNATIVES.md) for Python, static-only, and Yarn options.

### Quick Setup (Recommended)

**Option 1: One-command setup**
```bash
git clone https://github.com/JacobFullerOBU/FootballDataAnalysis.git
cd FootballDataAnalysis
./quick-start.sh
```

**Option 2: Manual npm setup**

1. Clone the repository:
```bash
git clone https://github.com/JacobFullerOBU/FootballDataAnalysis.git
cd FootballDataAnalysis
```

2. Install all dependencies and set up the project:
```bash
npm install
```

Both methods will automatically:
- Install backend dependencies
- Install frontend dependencies 
- Set up your environment file from `.env.example`

### Development

Start the development server (both backend and frontend):
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend development server on http://localhost:3000

### Alternative Development Commands

Start them separately if needed:

Backend only:
```bash
npm run dev:server
```

Frontend only:
```bash
npm run dev:client
```

### Manual Setup (If Needed)

If you prefer to set up manually or need to troubleshoot:

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
npm run install:client
```

3. Set up environment variables:
```bash
npm run setup:env
```

### Additional Commands

- **Build for production**: `npm run build`
- **Start production server**: `npm start` 
- **Clean everything**: `npm run clean`
- **Fresh install**: `npm run fresh-install`
- **Run tests**: `npm test`
- **Lint code**: `npm run lint`

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Games
- `GET /api/games/week/:season/:week` - Get games for a specific week
- `GET /api/games/recent/:limit?` - Get recent completed games
- `GET /api/games/upcoming/:limit?` - Get upcoming scheduled games
- `GET /api/games/:id` - Get specific game details

### Teams
- `GET /api/teams` - Get all teams (with optional type filter)
- `GET /api/teams/:id` - Get specific team details
- `GET /api/teams/:id/games/recent/:limit?` - Get team's recent games
- `GET /api/teams/:id/games/upcoming/:limit?` - Get team's upcoming games

### Statistics
- `GET /api/stats/weekly/:season/:week/:type` - Get weekly analysis
- `GET /api/stats/season/:season/:type` - Get season statistics
- `GET /api/stats/game/:gameId` - Get game statistics
- `GET /api/stats/players/:gameId` - Get player statistics

### Betting
- `GET /api/betting/upcoming/:type?` - Get upcoming games with betting lines
- `GET /api/betting/game/:gameId` - Get betting lines for a specific game
- `GET /api/betting/compare/:gameId` - Compare betting lines across bookmakers

## Database Schema

The application uses SQLite with the following main tables:
- `teams` - Team information (NFL and college)
- `games` - Game schedules and results
- `players` - Player information
- `player_stats` - Individual player statistics
- `team_stats` - Team game statistics
- `betting_lines` - Betting odds and lines

## Data Sources

The application currently uses sample data for demonstration. In production, it can be integrated with:
- ESPN API for game data and statistics
- The Odds API for betting lines
- Sports Radar API for detailed statistics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Development Notes

- The backend includes automated data fetching scheduled to run daily at 6 AM
- Sample data is automatically created on first run
- The frontend uses responsive design principles for mobile and desktop
- TypeScript is used throughout for better code quality and IDE support