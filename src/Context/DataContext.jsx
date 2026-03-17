import React, { createContext, useContext } from 'react';

const DataContext = createContext({
  pubs: [],
  pints: [],
  addPint: () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  return (
    <DataContext.Provider value={{ pubs: [], pints: [], addPint: () => {} }}>
      {children}
    </DataContext.Provider>
  );
};