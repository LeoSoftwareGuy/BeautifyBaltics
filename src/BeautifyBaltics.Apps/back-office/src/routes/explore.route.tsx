import { createRoute } from '@tanstack/react-router';

import ExplorePage from '@/features/explore/explore-page';

import { rootRoute } from './__root';

export const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});
