import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import PubCard from '../components/PubCard';
import { useData } from '../context/DataContext';

// --- Standard fix for Leaflet marker icons in React ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------------------------

const MapPage = () => {
  const { pubs } = useData();

  // Center the map on Dublin based on your mock data
  const defaultCenter = [53.345, -6.26]; 

  return (
    <div className="map-page">
      <h2>Pub Map</h2>
      
      <div className="map-container-wrapper" style={{ height: '400px', width: '100%', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Drop a pin for every pub in the global state */}
          {pubs.map(pub => (
            <Marker key={pub.id} position={[pub.latitude, pub.longitude]}>
              <Popup>
                <strong>{pub.name}</strong><br />
                {pub.city}<br />
                <Link to={`/pub/${pub.id}`}>View Pints</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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