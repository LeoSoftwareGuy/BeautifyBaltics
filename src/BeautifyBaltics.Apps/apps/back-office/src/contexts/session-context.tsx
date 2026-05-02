import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { UserRole } from '@/state/endpoints/api.schemas';
import { getGetUserQueryKey, useGetUser } from '@/state/endpoints/users';

type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
};

type SessionContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function SessionProvider({ children }: SessionProviderProps) {
  const queryClient = useQueryClient();
  const { data: userData, isLoading } = useGetUser({ query: { retry: false } });

  const user = useMemo<AuthUser | null>(() => {
    if (!userData?.id || !userData.email || !userData.role) return null;
    return {
      id: userData.id, email: userData.email, role: userData.role, fullName: userData.fullName ?? null,
    };
  }, [userData]);

  const login = useCallback(async ({ email, password, role }: { email: string; password: string; role: UserRole }) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw data;
    }

    const data = await response.json();
    queryClient.clear();
    queryClient.setQueryData(getGetUserQueryKey(), data);
  }, [queryClient]);

  const logout = useCallback(async () => {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    queryClient.clear();
  }, [queryClient]);

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading: isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
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
