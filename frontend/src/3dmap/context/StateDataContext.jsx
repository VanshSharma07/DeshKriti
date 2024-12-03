import React, { createContext, useState, useContext } from 'react';

const StateDataContext = createContext();

export function StateDataProvider({ children }) {
  const [stateData, setStateData] = useState(null);
  const [detailedStateData, setDetailedStateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStateData = async () => {
    if (stateData && detailedStateData) return; // Already loaded
    
    setIsLoading(true);
    try {
      // Dynamically import the data
      const { stateData: basicData, detailedStateData: detailedData } = 
        await import('../data/stateData.js');
      
      setStateData(basicData);
      setDetailedStateData(detailedData);
    } catch (error) {
      console.error('Error loading state data:', error);
    }
    setIsLoading(false);
  };

  return (
    <StateDataContext.Provider value={{
      stateData,
      detailedStateData,
      isLoading,
      loadStateData
    }}>
      {children}
    </StateDataContext.Provider>
  );
}

export function useStateData() {
  return useContext(StateDataContext);
} 