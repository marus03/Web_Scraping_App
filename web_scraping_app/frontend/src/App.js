// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ScrapedAnalysis from './components/ScrapedAnalysis';
import Scrape from './components/Scrape'; // Importuj Scrape
import TrendAnalysis from './components/TrendAnalysis';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scraped-analysis" element={<ScrapedAnalysis />} />
          <Route path="/scrape" element={<Scrape />} /> {/* Dodaj trasę do Scrape */}
          <Route path="/trends" element={<TrendAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;