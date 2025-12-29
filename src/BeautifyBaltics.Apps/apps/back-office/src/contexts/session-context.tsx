import React, {
  createContext, useCallback, useContext, useEffect, useMemo,
} from 'react';

import { GetUserSessionByIdResponse } from '@/state/endpoints/api.schemas';
import { useGetSession } from '@/state/endpoints/session';

type Session = GetUserSessionByIdResponse & {
  logout: () => void;
};

const SessionContext = createContext<Session | null>(null);

interface SessionProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function SessionProvider({ children }: SessionProviderProps) {
  const {
    data: user, isLoading,
  } = useGetSession({ query: { retry: false } });

  useEffect(() => {
    if (isLoading || user?.isAuthenticated) {
      return;
    }

    window.location.href = `/api/v1/auth/signin?redirectUrl=${getLocationHref()}`;
  }, [user?.isAuthenticated, isLoading]);

  const handleLogout = useCallback(() => {
    window.location.href = `/api/v1/auth/signout?redirectUrl=${getLocationHref()}`;
  }, []);

  const getLocationHref = () => encodeURI(window.location.href);

  const contextValue = useMemo(() => {
    if (!user) return null;
    return { ...user, logout: handleLogout };
  }, [user, handleLogout]);

  if (!user?.isAuthenticated) return null;

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within a SessionProvider');
  return context;
};

export default SessionProvider;
