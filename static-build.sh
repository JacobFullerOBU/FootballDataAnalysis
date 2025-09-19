#!/bin/bash

echo "🏈 Football Data Analysis - Static Build (No NPM Required)"
echo "========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "client/package.json" ]; then
    echo "❌ Please run this script from the repository root directory"
    exit 1
fi

# Create static output directory
STATIC_DIR="static-build"
echo "📁 Creating static build directory: $STATIC_DIR"
mkdir -p "$STATIC_DIR"

# Copy HTML template
echo "📄 Creating index.html..."
cat > "$STATIC_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Data Analysis</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            padding: 20px;
        }
        
        .section h2 {
            color: #1e3c72;
            margin-bottom: 15px;
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .team-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .team-logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 10px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        
        .games-list {
            list-style: none;
        }
        
        .game-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .status.completed {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status.scheduled {
            background-color: #ffeaa7;
            color: #856404;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏈 Football Data Analysis</h1>
        <p>Static Version - No Backend Required</p>
    </div>
    
    <div class="container">
        <div class="section">
            <h2>📊 Application Status</h2>
            <p>✅ Frontend: Static HTML/JavaScript</p>
            <p>✅ Data: Mock data included</p>
            <p>✅ Dependencies: None required</p>
            <p>🚀 Ready to deploy to any static hosting service!</p>
        </div>
        
        <div class="section">
            <h2>🏈 Teams</h2>
            <div id="teams-container" class="loading">Loading teams...</div>
        </div>
        
        <div class="section">
            <h2>🎮 Recent Games</h2>
            <div id="games-container" class="loading">Loading games...</div>
        </div>
        
        <div class="section">
            <h2>📈 Betting Lines</h2>
            <div id="betting-container" class="loading">Loading betting data...</div>
        </div>
    </div>
    
    <script src="app.js"></script>
</body>
</html>
EOF

echo "📄 Creating app.js..."
cat > "$STATIC_DIR/app.js" << 'EOF'
// Mock data for the static version
const mockData = {
    teams: [
        {
            id: 1,
            name: "Kansas City Chiefs",
            shortName: "KC",
            type: "nfl",
            conference: "AFC",
            division: "West",
            city: "Kansas City",
            state: "Missouri",
            logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
            primaryColor: "#E31837"
        },
        {
            id: 2,
            name: "Buffalo Bills",
            shortName: "BUF",
            type: "nfl",
            conference: "AFC",
            division: "East",
            city: "Buffalo",
            state: "New York",
            logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
            primaryColor: "#00338D"
        },
        {
            id: 101,
            name: "Alabama Crimson Tide",
            shortName: "ALA",
            type: "college",
            conference: "SEC",
            division: "West",
            city: "Tuscaloosa",
            state: "Alabama",
            logo: "https://a.espncdn.com/i/teamlogos/ncf/500/333.png",
            primaryColor: "#9E1B32"
        },
        {
            id: 102,
            name: "Georgia Bulldogs",
            shortName: "UGA",
            type: "college",
            conference: "SEC",
            division: "East",
            city: "Athens",
            state: "Georgia",
            logo: "https://a.espncdn.com/i/teamlogos/ncf/500/61.png",
            primaryColor: "#BA0C2F"
        }
    ],
    games: [
        {
            id: 1,
            homeTeamId: 1,
            awayTeamId: 2,
            homeScore: 31,
            awayScore: 17,
            gameDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "completed",
            week: 15,
            season: 2024,
            type: "nfl"
        },
        {
            id: 2,
            homeTeamId: 101,
            awayTeamId: 102,
            homeScore: null,
            awayScore: null,
            gameDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "scheduled",
            week: 16,
            season: 2024,
            type: "college"
        }
    ],
    bettingLines: [
        {
            id: 1,
            gameId: 2,
            bookmaker: "DraftKings",
            homeSpread: -3.5,
            awaySpread: 3.5,
            overUnder: 55.5,
            homeMoneyline: -165,
            awayMoneyline: 140
        }
    ]
};

// Utility functions
function getTeamById(id) {
    return mockData.teams.find(team => team.id === id);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Render functions
function renderTeams() {
    const container = document.getElementById('teams-container');
    const teamsHTML = mockData.teams.map(team => `
        <div class="team-card">
            <div class="team-logo" style="background-image: url('${team.logo}')"></div>
            <h3>${team.name}</h3>
            <p>${team.type.toUpperCase()} - ${team.conference} ${team.division}</p>
            <p>${team.city}, ${team.state}</p>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="team-grid">${teamsHTML}</div>`;
}

function renderGames() {
    const container = document.getElementById('games-container');
    const gamesHTML = mockData.games.map(game => {
        const homeTeam = getTeamById(game.homeTeamId);
        const awayTeam = getTeamById(game.awayTeamId);
        
        let scoreDisplay = '';
        if (game.status === 'completed') {
            scoreDisplay = `${awayTeam.shortName} ${game.awayScore} - ${game.homeScore} ${homeTeam.shortName}`;
        } else {
            scoreDisplay = `${awayTeam.shortName} @ ${homeTeam.shortName}`;
        }
        
        return `
            <li class="game-item">
                <div>
                    <strong>${scoreDisplay}</strong>
                    <br>
                    <small>${formatDate(game.gameDate)}</small>
                </div>
                <span class="status ${game.status}">${game.status}</span>
            </li>
        `;
    }).join('');
    
    container.innerHTML = `<ul class="games-list">${gamesHTML}</ul>`;
}

function renderBetting() {
    const container = document.getElementById('betting-container');
    const bettingHTML = mockData.bettingLines.map(line => {
        const game = mockData.games.find(g => g.id === line.gameId);
        const homeTeam = getTeamById(game.homeTeamId);
        const awayTeam = getTeamById(game.awayTeamId);
        
        return `
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <h4>${awayTeam.name} @ ${homeTeam.name}</h4>
                <p><strong>Bookmaker:</strong> ${line.bookmaker}</p>
                <p><strong>Spread:</strong> ${homeTeam.shortName} ${line.homeSpread}</p>
                <p><strong>Over/Under:</strong> ${line.overUnder}</p>
                <p><strong>Moneyline:</strong> ${homeTeam.shortName} ${line.homeMoneyline}, ${awayTeam.shortName} ${line.awayMoneyline}</p>
            </div>
        `;
    }).join('');
    
    container.innerHTML = bettingHTML || '<p>No betting lines available</p>';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading delay
    setTimeout(() => {
        renderTeams();
        renderGames();
        renderBetting();
    }, 500);
});
EOF

echo "📄 Creating README for static build..."
cat > "$STATIC_DIR/README.md" << 'EOF'
# Football Data Analysis - Static Build

This is a static version of the Football Data Analysis application that runs entirely in the browser without requiring any backend or npm dependencies.

## Features

- ✅ No Node.js or npm required
- ✅ No backend server needed
- ✅ Works with any web server or static hosting
- ✅ Mock data included for demonstration
- ✅ Responsive design

## Usage

### Local Testing

1. **Using Python (if available):**
   ```bash
   cd static-build
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000

2. **Using any web server:**
   - Apache: Copy files to your web root
   - Nginx: Copy files to your web root
   - Any static hosting service

### Deployment Options

- **GitHub Pages**: Upload files to your GitHub Pages repository
- **Netlify**: Drag and drop the static-build folder
- **Vercel**: Deploy the static-build folder
- **AWS S3**: Upload files to an S3 bucket with static hosting
- **Any web hosting service**: Upload files via FTP/SFTP

## Customization

Edit `app.js` to modify the mock data or add new features. The data structure matches the original API format, so you can easily integrate with real APIs later.

## Browser Compatibility

Works in all modern browsers (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+).
EOF

echo ""
echo "✅ Static build created successfully!"
echo ""
echo "📁 Files created in: $STATIC_DIR/"
echo "   - index.html (main application)"
echo "   - app.js (JavaScript with mock data)"
echo "   - README.md (deployment instructions)"
echo ""
echo "🚀 To test locally:"
echo "   cd $STATIC_DIR"
echo "   python3 -m http.server 8000"
echo "   # Then open http://localhost:8000"
echo ""
echo "📤 To deploy:"
echo "   Upload the contents of '$STATIC_DIR' to any static hosting service"
echo ""