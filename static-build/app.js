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
