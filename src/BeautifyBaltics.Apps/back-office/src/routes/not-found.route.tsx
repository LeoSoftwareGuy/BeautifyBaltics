import { createRoute } from '@tanstack/react-router';

import NotFoundPage from '@/features/not-found/not-found-page';

import { rootRoute } from './__root';

export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});
