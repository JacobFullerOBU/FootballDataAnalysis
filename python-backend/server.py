#!/usr/bin/env python3
"""
Football Data Analysis - Python Backend Alternative
A Flask-based backend that provides the same API as the Node.js version
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import sqlite3
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Mock data - equivalent to the mockData.ts
def get_mock_teams():
    return [
        {
            "id": 1,
            "name": "Kansas City Chiefs",
            "shortName": "KC",
            "type": "nfl",
            "conference": "AFC",
            "division": "West",
            "city": "Kansas City",
            "state": "Missouri",
            "logo": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
            "primaryColor": "#E31837",
            "secondaryColor": "#FFB81C"
        },
        {
            "id": 2,
            "name": "Buffalo Bills",
            "shortName": "BUF",
            "type": "nfl",
            "conference": "AFC",
            "division": "East",
            "city": "Buffalo",
            "state": "New York",
            "logo": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
            "primaryColor": "#00338D",
            "secondaryColor": "#C60C30"
        },
        {
            "id": 101,
            "name": "Alabama Crimson Tide",
            "shortName": "ALA",
            "type": "college",
            "conference": "SEC",
            "division": "West",
            "city": "Tuscaloosa",
            "state": "Alabama",
            "logo": "https://a.espncdn.com/i/teamlogos/ncf/500/333.png",
            "primaryColor": "#9E1B32",
            "secondaryColor": "#FFFFFF"
        },
        {
            "id": 102,
            "name": "Georgia Bulldogs",
            "shortName": "UGA",
            "type": "college",
            "conference": "SEC",
            "division": "East",
            "city": "Athens",
            "state": "Georgia",
            "logo": "https://a.espncdn.com/i/teamlogos/ncf/500/61.png",
            "primaryColor": "#BA0C2F",
            "secondaryColor": "#000000"
        }
    ]

def get_mock_games():
    teams = get_mock_teams()
    now = datetime.now()
    return [
        {
            "id": 1,
            "homeTeamId": 1,
            "awayTeamId": 2,
            "homeScore": 31,
            "awayScore": 17,
            "gameDate": (now - timedelta(days=3)).isoformat(),
            "status": "completed",
            "week": 15,
            "season": 2024,
            "type": "nfl"
        },
        {
            "id": 2,
            "homeTeamId": 101,
            "awayTeamId": 102,
            "homeScore": None,
            "awayScore": None,
            "gameDate": (now + timedelta(days=2)).isoformat(),
            "status": "scheduled",
            "week": 16,
            "season": 2024,
            "type": "college"
        }
    ]

def get_mock_betting_lines():
    return [
        {
            "id": 1,
            "gameId": 2,
            "bookmaker": "DraftKings",
            "homeSpread": -3.5,
            "awaySpread": 3.5,
            "homeOdds": -110,
            "awayOdds": -110,
            "overUnder": 55.5,
            "overOdds": -110,
            "underOdds": -110,
            "homeMoneyline": -165,
            "awayMoneyline": 140,
            "lastUpdated": datetime.now().isoformat()
        }
    ]

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Python backend is running"})

@app.route('/api/teams', methods=['GET'])
def get_teams():
    team_type = request.args.get('type')
    teams = get_mock_teams()
    
    if team_type:
        teams = [team for team in teams if team['type'] == team_type]
    
    return jsonify(teams)

@app.route('/api/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    teams = get_mock_teams()
    team = next((team for team in teams if team['id'] == team_id), None)
    
    if not team:
        return jsonify({"error": "Team not found"}), 404
    
    return jsonify(team)

@app.route('/api/games/upcoming/<int:limit>', methods=['GET'])
def get_upcoming_games(limit):
    games = get_mock_games()
    upcoming = [game for game in games if game['status'] == 'scheduled']
    return jsonify(upcoming[:limit])

@app.route('/api/games/recent/<int:limit>', methods=['GET'])
def get_recent_games(limit):
    games = get_mock_games()
    recent = [game for game in games if game['status'] == 'completed']
    return jsonify(recent[:limit])

@app.route('/api/betting/upcoming/all', methods=['GET'])
def get_betting_lines():
    return jsonify(get_mock_betting_lines())

@app.route('/api/stats/weekly', methods=['GET'])
def get_weekly_stats():
    return jsonify({
        "week": 15,
        "season": 2024,
        "totalGames": 16,
        "completedGames": 12,
        "upcomingGames": 4,
        "averageScore": 23.5,
        "highestScore": 45,
        "lastUpdated": datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    print(f"🏈 Football Data Analysis - Python Backend")
    print(f"Running on http://localhost:{port}")
    print(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
