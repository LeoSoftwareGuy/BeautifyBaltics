import { createRoute } from '@tanstack/react-router';

import MasterProfilePage from '@/features/master/master-profile-page';

import { rootRoute } from './__root';

export const masterProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/master/$masterId',
  component: MasterProfilePage,
});
