import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Session as SupabaseSession, User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/integrations/supabase/client';

type SessionContextValue = {
  user: User | null;
  session: SupabaseSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (params: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data?.session ?? null);
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setLoading(false);
    });

    loadSession();

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    queryClient.clear();
  }, [queryClient, session?.user?.id]);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const register = useCallback(
    async ({ email, password, name }: { email: string; password: string; name?: string }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: name ? { full_name: name } : undefined,
        },
      });
      if (error) throw error;
    },
    [],
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isAuthenticated: Boolean(session?.access_token),
      loading,
      login,
      register,
      logout,
    }),
    [session, loading, login, register, logout],
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
