import { createFileRoute } from '@tanstack/react-router';

import { MasterBookingsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/bookings/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/bookings');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.masterDashboard', path: '/master' },
        { titleKey: 'navigation.breadcrumbs.masterBookings', path: '/master/bookings' },
      ],
    });
  },
  component: MasterBookingsRoute,
});

function MasterBookingsRoute() {
  return <MasterBookingsPage />;
}
