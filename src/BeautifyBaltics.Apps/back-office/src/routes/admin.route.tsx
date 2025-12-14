import { createRoute } from '@tanstack/react-router';

import AdminDashboardPage from '@/features/admin/admin-dashboard-page';

import { rootRoute } from './__root';

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});
