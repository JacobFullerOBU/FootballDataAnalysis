# Stats Update API Usage Guide

This guide explains how to use the API endpoints to update football statistics.

## Overview

The Football Data Analysis application now supports creating and updating both team and player statistics through RESTful API endpoints.

## Team Statistics

### Create Team Stats
Create new team statistics for a specific game.

**Endpoint:** `POST /api/stats/team`

**Required Fields:**
- `game_id` (number) - ID of the game
- `team_id` (number) - ID of the team

**Optional Fields:**
- `total_yards` (number, default: 0)
- `passing_yards` (number, default: 0) 
- `rushing_yards` (number, default: 0)
- `turnovers` (number, default: 0)
- `penalties` (number, default: 0)
- `penalty_yards` (number, default: 0)
- `time_of_possession` (string, default: null)
- `third_down_conversions` (string, default: null)
- `fourth_down_conversions` (string, default: null)

**Example:**
```bash
curl -X POST "http://localhost:3001/api/stats/team" \
-H "Content-Type: application/json" \
-d '{
  "game_id": 1,
  "team_id": 1,
  "total_yards": 350,
  "passing_yards": 220,
  "rushing_yards": 130,
  "turnovers": 1,
  "penalties": 5,
  "penalty_yards": 45
}'
```

**Response:**
```json
{
  "message": "Team stats created successfully",
  "id": 1,
  "gameId": 1,
  "teamId": 1
}
```

### Update Team Stats
Update existing team statistics for a specific game and team.

**Endpoint:** `PUT /api/stats/team/:gameId/:teamId`

**Optional Fields:** (only include fields you want to update)
- Any of the fields listed above for creating team stats

**Example:**
```bash
curl -X PUT "http://localhost:3001/api/stats/team/1/1" \
-H "Content-Type: application/json" \
-d '{
  "passing_yards": 275,
  "turnovers": 2
}'
```

**Response:**
```json
{
  "message": "Team stats updated successfully",
  "gameId": 1,
  "teamId": 1,
  "updatedFields": ["passing_yards", "turnovers"]
}
```

## Player Statistics

### Create Player Stats
Create new player statistics for a specific game.

**Endpoint:** `POST /api/stats/player`

**Required Fields:**
- `game_id` (number) - ID of the game
- `player_id` (number) - ID of the player
- `team_id` (number) - ID of the team

**Optional Fields:**
- `passing_yards` (number, default: 0)
- `passing_touchdowns` (number, default: 0)
- `rushing_yards` (number, default: 0)
- `rushing_touchdowns` (number, default: 0)
- `receiving_yards` (number, default: 0)
- `receiving_touchdowns` (number, default: 0)
- `tackles` (number, default: 0)
- `sacks` (number, default: 0)
- `interceptions` (number, default: 0)

**Example:**
```bash
curl -X POST "http://localhost:3001/api/stats/player" \
-H "Content-Type: application/json" \
-d '{
  "game_id": 1,
  "player_id": 1,
  "team_id": 1,
  "passing_yards": 275,
  "passing_touchdowns": 2,
  "rushing_yards": 15,
  "rushing_touchdowns": 1
}'
```

**Response:**
```json
{
  "message": "Player stats created successfully",
  "id": 1,
  "gameId": 1,
  "playerId": 1,
  "teamId": 1
}
```

### Update Player Stats
Update existing player statistics for a specific game and player.

**Endpoint:** `PUT /api/stats/player/:gameId/:playerId`

**Optional Fields:** (only include fields you want to update)
- Any of the fields listed above for creating player stats

**Example:**
```bash
curl -X PUT "http://localhost:3001/api/stats/player/1/1" \
-H "Content-Type: application/json" \
-d '{
  "passing_yards": 300,
  "passing_touchdowns": 3,
  "interceptions": 1
}'
```

**Response:**
```json
{
  "message": "Player stats updated successfully",
  "gameId": 1,
  "playerId": 1,
  "updatedFields": ["passing_yards", "passing_touchdowns", "interceptions"]
}
```

## Client-Side Usage

In the React frontend, you can use the API service methods:

```typescript
import { statsAPI } from '../services/api';

// Create team stats
const newTeamStats = await statsAPI.createTeamStats({
  game_id: 1,
  team_id: 1,
  passing_yards: 275,
  rushing_yards: 130
});

// Update team stats
const updateResult = await statsAPI.updateTeamStats(1, 1, {
  passing_yards: 300,
  turnovers: 2
});

// Create player stats  
const newPlayerStats = await statsAPI.createPlayerStats({
  game_id: 1,
  player_id: 1,
  team_id: 1,
  passing_yards: 275,
  passing_touchdowns: 2
});

// Update player stats
const playerUpdateResult = await statsAPI.updatePlayerStats(1, 1, {
  passing_yards: 300,
  interceptions: 1
});
```

## Error Handling

### Common Error Responses

**400 Bad Request** - Invalid data provided
```json
{
  "error": "game_id and team_id are required"
}
```

**404 Not Found** - Stats not found for update
```json
{
  "error": "Team stats not found"
}
```

**409 Conflict** - Attempting to create duplicate stats
```json
{
  "error": "Team stats already exist for this game. Use PUT to update."
}
```

**500 Internal Server Error** - Database or server error
```json
{
  "error": "Internal server error"
}
```

## Notes

- All numeric fields accept integers
- String fields like `time_of_possession` can be formatted as "MM:SS" 
- Conversion fields like `third_down_conversions` can be formatted as "3/10"
- Only valid database fields are accepted - invalid fields are ignored
- Partial updates are supported - only include the fields you want to change
- Stats must be created before they can be updated