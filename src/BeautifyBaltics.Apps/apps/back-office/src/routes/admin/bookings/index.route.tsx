import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { AdminBookingsPage } from '@/features/admin/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/admin/bookings/')({
  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    sortBy: z.string().optional(),
    ascending: z.boolean().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }).catch({}),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/admin/bookings');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.adminDashboard', path: '/admin' },
        { titleKey: 'navigation.breadcrumbs.adminBookings', path: '/admin/bookings' },
      ],
    });
  },
  component: AdminBookingsRoute,
});

function AdminBookingsRoute() {
  return <AdminBookingsPage />;
}
