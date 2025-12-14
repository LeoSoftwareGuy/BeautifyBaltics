import { createRoute } from '@tanstack/react-router';

import LoginPage from '@/features/auth/login-page';

import { rootRoute } from './__root';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});
