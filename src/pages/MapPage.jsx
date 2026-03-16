import React from 'react';
import PubCard from '../components/PubCard';
import { useData } from '../context/DataContext';

const MapPage = () => {
  const { pubs } = useData(); // Get live pub list

  return (
    <div className="map-page">
      <h2>Pub Map</h2>
      {/* Placeholder for an actual interactive Map component */}
      <div className="map-placeholder" style={{ height: '300px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
        <p>Interactive Map Component Goes Here</p>
      </div>
      
      <div className="map-pub-list">
        <h3>Nearby Pubs</h3>
        <div className="pub-grid">
          {pubs.map(pub => (
            <PubCard key={pub.id} pub={pub} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;