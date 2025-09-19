import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import gamesRouter from './routes/games';
import teamsRouter from './routes/teams';
import statsRouter from './routes/stats';
import bettingRouter from './routes/betting';
import { Database } from './services/database';
import { DataFetcher } from './services/dataFetcher';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const database = new Database();

// Initialize data fetcher with database instance
const dataFetcher = new DataFetcher(database);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Store database instance in app locals
app.locals.database = database;

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API Routes
app.use('/api/games', gamesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/betting', bettingRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Serve client for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Error handling
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await database.initialize();
    console.log('Database initialized successfully');
    
    // Start data fetching service
    dataFetcher.startScheduledFetching();
    console.log('Data fetching service started');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;