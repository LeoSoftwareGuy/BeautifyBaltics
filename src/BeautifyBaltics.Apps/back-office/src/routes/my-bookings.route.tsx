import { createRoute } from '@tanstack/react-router';

import CustomerDashboardPage from '@/features/customer/customer-dashboard-page';

import { rootRoute } from './__root';

export const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-bookings',
  component: CustomerDashboardPage,
});
