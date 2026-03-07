import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { ClientDashboardOverviewPage } from '@/features/client';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/client/bookings/')({
  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    sortBy: z.string().optional(),
    ascending: z.boolean().optional(),
    status: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }).catch({}),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/client/bookings');
    return {
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.clientBookings', path: '/client/bookings' },
      ],
    };
  },
  component: ClientBookingsRoute,
});

function ClientBookingsRoute() {
  return <ClientDashboardOverviewPage />;
}
