import React, { createContext, useState, useContext, useMemo } from 'react';

const ArchitectContext = createContext();

export const ArchitectProvider = ({ children }) => {
  const [activeStyles, setActiveStyles] = useState([]);
  const [customText, setCustomText] = useState('');

  // Memoize the final prompt so it only recalculates if styles or text change
  const memoizedArchitectPrompt = useMemo(() => {
    const prompts = activeStyles.map(s => s.prompt);
    return [...prompts, customText].join(' ').trim() || 'Write a professional report.';
  }, [activeStyles, customText]);

  return (
    <ArchitectContext.Provider value={{ 
      activeStyles, setActiveStyles, 
      customText, setCustomText, 
      memoizedArchitectPrompt 
    }}>
      {children}
    </ArchitectContext.Provider>
  );
};

export const useArchitect = () => useContext(ArchitectContext);