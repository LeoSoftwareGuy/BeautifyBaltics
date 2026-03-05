import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { MasterBookingsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/bookings/')({
  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    sortBy: z.string().optional(),
    ascending: z.boolean().optional(),
    status: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    search: z.string().optional(),
  }).catch({}),
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
