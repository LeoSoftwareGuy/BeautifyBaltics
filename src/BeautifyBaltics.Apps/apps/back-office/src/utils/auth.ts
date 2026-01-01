import { redirect } from '@tanstack/react-router';

import { supabase } from '@/integrations/supabase/client';
import type { FileRouteTypes } from '@/routeTree.gen';

type RoutePath = FileRouteTypes['to'];
const LOGIN_ROUTE: RoutePath = '/login';
const DEFAULT_DESTINATION: RoutePath = '/home';
const allowedPaths: RoutePath[] = ['/', '/home', '/login', '/register'];

export const normalizeRoutePath = (target?: string): RoutePath => {
  if (!target) return DEFAULT_DESTINATION;

  const normalized = target.endsWith('/') && target !== '/'
    ? (target.replace(/\/+$/, '') as RoutePath)
    : (target as RoutePath);

  return allowedPaths.includes(normalized) ? normalized : DEFAULT_DESTINATION;
};

export const requireAuthenticated = async (redirectPath: string) => {
  const target = normalizeRoutePath(redirectPath);
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw redirect({
      to: LOGIN_ROUTE,
      search: {
        redirect: target,
      },
    });
  }

  return data.session;
};

export const redirectIfAuthenticated = async (destination: RoutePath = DEFAULT_DESTINATION) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return;
  }

  if (data.session) {
    throw redirect({ to: normalizeRoutePath(destination) });
  }
};
