import React, {
  createContext, useContext, useMemo,
} from 'react';

import { GetSettingsResponse } from '@/state/endpoints/api.schemas';
import { useGetSettings } from '@/state/endpoints/settings';

type Settings = GetSettingsResponse;

const SettingsContext = createContext<Settings | null>(null);

interface SettingsProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const { data, isLoading } = useGetSettings();

  const contextValue = useMemo(() => {
    if (!data) return null;
    return data;
  }, [data]);

  if (isLoading) return null;

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export default SettingsProvider;
