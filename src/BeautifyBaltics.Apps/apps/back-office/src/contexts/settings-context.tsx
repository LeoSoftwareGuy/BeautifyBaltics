import React, { createContext, useContext, useMemo } from 'react';

type Settings = {
  companyName: string;
};

const SettingsContext = createContext<Settings | null>(null);

interface SettingsProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const contextValue = useMemo<Settings>(
    () => ({
      companyName: 'Beautify Baltics',
    }),
    [],
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsProvider;
