import { createRoute } from '@tanstack/react-router';

import MasterDashboardPage from '@/features/master/master-dashboard-page';

import { rootRoute } from './__root';

export const masterDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/master-dashboard',
  component: MasterDashboardPage,
});
