import { createFileRoute } from '@tanstack/react-router';

import { ClientDashboardPage } from '@/features/client';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/client/bookings/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/client/bookings');
    return {
      breadcrumbs: [
        { title: 'My Bookings', path: '/client/bookings' },
      ],
    };
  },
  component: ClientBookingsRoute,
});

function ClientBookingsRoute() {
  return <ClientDashboardPage />;
}
