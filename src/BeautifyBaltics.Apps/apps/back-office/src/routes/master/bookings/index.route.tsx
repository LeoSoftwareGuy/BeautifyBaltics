import { createFileRoute } from '@tanstack/react-router';

import { MasterBookingsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/bookings/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/bookings');

    return ({
      breadcrumbs: [
        { title: 'Dashboard', path: '/master' },
        { title: 'Bookings', path: '/master/bookings' },
      ],
    });
  },
  component: MasterBookingsRoute,
});

function MasterBookingsRoute() {
  return <MasterBookingsPage />;
}
