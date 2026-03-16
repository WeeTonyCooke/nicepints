import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext'; // Import Provider and hook

import Navigation from './components/Navigation';
import AddPintModal from './components/AddPintModal';
import PintCard from './components/PintCard';
import MapPage from './pages/MapPage';
import PubPage from './pages/PubPage';

// Update Feed to consume context instead of static imports
const Feed = () => {
  const { pints } = useData(); // Pull live state here
  
  return (
    <div className="feed-page">
      <h2>Recent Pints</h2>
      <div className="pint-feed">
        {pints.map(pint => (
          <PintCard key={pint.id} pint={pint} />
        ))}
      </div>
    </div>
  );
};

// ... Rankings component remains the same

function App() {
  const [isAddPintModalOpen, setIsAddPintModalOpen] = useState(false);

  return (
    <DataProvider> {/* Wrap everything so the context is available globally */}
      <Router>
        <div className="app-container">
          <Navigation onAddPintClick={() => setIsAddPintModalOpen(true)} />

          <main className="content-area">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/pub/:id" element={<PubPage />} />
            </Routes>
          </main>

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