import { createContext, useContext } from 'react';

import { AppLayoutConfiguration } from './types';

type AppLayoutContextType = AppLayoutConfiguration;

export const AppLayoutContext = createContext<AppLayoutContextType>({} as AppLayoutContextType);

export const useLayout = () => {
  const context = useContext(AppLayoutContext);
  if (!context) throw new Error('useLayout must be used within a AppLayoutContext');
  return context;
};
