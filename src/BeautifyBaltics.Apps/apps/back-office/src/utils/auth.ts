import { redirect } from '@tanstack/react-router';

import type { FileRouteTypes } from '@/routeTree.gen';
import { getUser } from '@/state/endpoints/users';

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
  try {
    const user = await getUser();
    return user;
  } catch {
    throw redirect({
      to: LOGIN_ROUTE,
      search: {
        redirect: target,
      },
    });
  }
};

export const redirectIfAuthenticated = async (destination: RoutePath = DEFAULT_DESTINATION) => {
  let isAuthenticated = false;
  try {
    await getUser();
    isAuthenticated = true;
  } catch {
    // getUser failed (likely 401) — user not authenticated, stay on page
  }

  if (isAuthenticated) {
    throw redirect({ to: normalizeRoutePath(destination) });
  }
};
