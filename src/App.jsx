import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

// Context
import { DataProvider, useData } from './context/DataContext';

// Components
import Navigation from './components/Navigation';
import AddPintModal from './components/AddPintModal';
import PintCard from './components/PintCard';

// Pages
import MapPage from './pages/MapPage';
import PubPage from './pages/PubPage';
import RankingsPage from './pages/RankingsPage'; // <-- Imported the new page

// --- Temporary inline Feed component ---
const Feed = () => {
  const { pints } = useData(); 
  
  return (
    <div className="feed-page">
      <h2>Recent Pints</h2>
      <div className="pint-feed">
        {pints.map(pint => (
          <PintCard key={pint.id} pint={pint} />
        ))}
        {pints.length === 0 && <p>No pints recorded yet. Be the first!</p>}
      </div>
    </div>
  );
};

// --- Main App Component ---

function App() {
  // Modal state managed at the top level so it acts as a global overlay
  const [isAddPintModalOpen, setIsAddPintModalOpen] = useState(false);

  return (
    <DataProvider> 
      <Router>
        <div className="app-container">
          
          {/* Top Navigation */}
          <Navigation onAddPintClick={() => setIsAddPintModalOpen(true)} />

          {/* Main Content Routing */}
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/rankings" element={<RankingsPage />} /> {/* <-- Updated Route */}
              <Route path="/pub/:id" element={<PubPage />} />
            </Routes>
          </main>

          {/* Global Add Pint Modal */}
          <AddPintModal 
            isOpen={isAddPintModalOpen} 
            onClose={() => setIsAddPintModalOpen(false)} 
          />
          
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;