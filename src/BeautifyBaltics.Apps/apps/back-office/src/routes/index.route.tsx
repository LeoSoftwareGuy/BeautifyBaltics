import { createRoute } from '@tanstack/react-router';

import HomePage from '@/features/home/home-page';

import { rootRoute } from './__root';

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
