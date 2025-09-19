import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Teams from './pages/Teams';
import Analytics from './pages/Analytics';
import Betting from './pages/Betting';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/betting" element={<Betting />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
