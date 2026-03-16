import React, { createContext, useState, useContext } from 'react';
import { pubs as initialPubs, pints as initialPints } from '../data/mockData';

// Create the context
const DataContext = createContext();

// Custom hook to make using the context easier
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [pubs, setPubs] = useState(initialPubs);
  const [pints, setPints] = useState(initialPints);

  // Function to handle adding a new pint
  const addPint = (formData) => {
    const newPint = {
      id: `pint_${Date.now()}`, // Generate a fake unique ID
      // If a real photo was uploaded, create a temporary local URL for it, otherwise use a placeholder
      photo_url: formData.photo 
        ? URL.createObjectURL(formData.photo) 
        : 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=800&q=80',
      score: parseFloat(formData.score),
      caption: formData.note,
      // For now, if they didn't skip, just attach it to the first pub as a mock example
      pub_id: formData.locationMethod === 'skip' ? null : 'pub_1', 
      user: 'You', // Hardcoded active user
      created_at: new Date().toISOString()
    };

    // Add the new pint to the beginning of the array so it shows up first
    setPints([newPint, ...pints]);
  };

  return (
    <DataContext.Provider value={{ pubs, pints, addPint }}>
      {children}
    </DataContext.Provider>
  );
};