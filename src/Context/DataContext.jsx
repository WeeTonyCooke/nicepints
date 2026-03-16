import React, { createContext, useState, useContext } from 'react';
import { pubs as initialPubs, pints as initialPints } from '../data/mockData';

// --- Math Helpers ---

// Calculate distance between two coordinates in kilometers using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
};

// Find the closest pub from the array
const findNearestPub = (userLat, userLon, pubsList) => {
  if (!pubsList || pubsList.length === 0) return null;
  
  let nearestPub = null;
  let minDistance = Infinity;

  pubsList.forEach(pub => {
    const distance = calculateDistance(userLat, userLon, pub.latitude, pub.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPub = pub;
    }
  });

  // Only auto-assign the pub if the user is within 2km of it
  return minDistance <= 2 ? nearestPub.id : null; 
};

// --- Context Setup ---

// Create the context
const DataContext = createContext();

// Custom hook to make using the context easier across components
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [pubs, setPubs] = useState(initialPubs);
  const [pints, setPints] = useState(initialPints);

  // Function to handle adding a new pint from the modal
  const addPint = (formData) => {
    let assignedPubId = null;

    // 1. Determine which pub to attach the pint to based on the user's flow
    if (formData.locationMethod === 'location' && formData.latitude && formData.longitude) {
      // Auto-detect the nearest pub using our helper
      assignedPubId = findNearestPub(formData.latitude, formData.longitude, pubs);
      
    } else if (formData.locationMethod === 'search' && formData.selectedPubId) {
      // User selected an existing pub from the search dropdown
      assignedPubId = formData.selectedPubId;
      
    } else if (formData.locationMethod === 'manual' && formData.newPubName) {
      // User manually typed a new pub name. Create it and save it to the global pub list!
      const newPubId = `pub_${Date.now()}`;
      const newPub = {
        id: newPubId,
        name: formData.newPubName,
        city: formData.newPubCity || 'Unknown City',
        // Mock coordinates for manually added pubs so they don't break the map
        latitude: 53.34 + (Math.random() * 0.05 - 0.025), 
        longitude: -6.26 + (Math.random() * 0.05 - 0.025)
      };
      
      setPubs(prevPubs => [...prevPubs, newPub]);
      assignedPubId = newPubId;
    }
    // If locationMethod is 'skip', assignedPubId correctly remains null.

    // 2. Construct the new pint object
    const newPint = {
      id: `pint_${Date.now()}`,
      
      // Use a local blob URL for uploaded photos, or a fallback placeholder
      photo_url: formData.photo 
        ? URL.createObjectURL(formData.photo) 
        : 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=800&q=80',
        
      score: parseFloat(formData.score),
      caption: formData.note,
      pub_id: assignedPubId, 
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      user: 'You', // Hardcoded active user for now
      created_at: new Date().toISOString()
    };

    // 3. Add the new pint to the beginning of the array so it shows up first in the feed
    setPints(prevPints => [newPint, ...prevPints]);
  };

  return (
    <DataContext.Provider value={{ pubs, pints, addPint }}>
      {children}
    </DataContext.Provider>
  );
};