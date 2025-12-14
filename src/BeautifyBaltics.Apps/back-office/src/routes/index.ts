import { rootRoute } from './__root';
import { adminRoute } from './admin.route';
import { exploreRoute } from './explore.route';
import { homeRoute } from './index.route';
import { loginRoute } from './login.route';
import { masterDashboardRoute } from './master-dashboard.route';
import { masterProfileRoute } from './master.$masterId.route';
import { myBookingsRoute } from './my-bookings.route';
import { notFoundRoute } from './not-found.route';

export const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  exploreRoute,
  masterProfileRoute,
  masterDashboardRoute,
  adminRoute,
  myBookingsRoute,
  notFoundRoute,
]);
