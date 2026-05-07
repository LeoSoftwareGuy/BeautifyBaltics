import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { UserRole } from '@/state/endpoints/api.schemas';
import { getGetUserQueryKey } from '@/state/endpoints/users';

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const syncCurrentUser = useCallback(async () => {
    const response = await fetch('/api/v1/users', { credentials: 'include' });

    if (!response.ok) {
      setUser(null);
      return null;
    }

    const data = await response.json();
    const authUser: AuthUser = {
      id: data.id,
      email: data.email,
      role: data.role,
      fullName: data.fullName ?? null,
    };

    setUser(authUser);
    queryClient.setQueryData(getGetUserQueryKey(), data);

    return authUser;
  }, [queryClient]);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        if (!mounted) return;
        await syncCurrentUser();
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => { mounted = false; };
  }, [syncCurrentUser]);

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

    queryClient.clear();
    await syncCurrentUser();
  }, [queryClient, syncCurrentUser]);

  const logout = useCallback(async () => {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
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
