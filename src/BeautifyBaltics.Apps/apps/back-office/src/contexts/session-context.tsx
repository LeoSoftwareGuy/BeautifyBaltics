import React, { createContext, useContext, useMemo } from 'react';

type SessionUser = {
  email: string;
  name: string;
};

type Session = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  logout: () => void;
};

const SessionContext = createContext<Session | null>(null);

interface SessionProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function SessionProvider({ children }: SessionProviderProps) {
  const contextValue = useMemo<Session>(
    () => ({
      user: {
        name: 'Beautify Baltics User',
        email: 'user@beautifybaltics.com',
      },
      isAuthenticated: true,
      logout: () => {
        // Placeholder logout flow while authentication is not implemented.
        // Replace with redirect once backend auth is available.
        console.info('Logout requested, but authentication is not configured.');
      },
    }),
    [],
  );

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export default SessionProvider;
