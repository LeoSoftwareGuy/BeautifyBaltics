import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { AdminServicesPage } from '@/features/admin/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/admin/services/')({
  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    sortBy: z.string().optional(),
    ascending: z.boolean().optional(),
    text: z.string().optional(),
    categoryId: z.string().optional(),
    tab: z.string().optional(),
  }).catch({}),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/admin/services');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.adminDashboard', path: '/admin' },
        { titleKey: 'navigation.breadcrumbs.adminServices', path: '/admin/services' },
      ],
    });
  },
  component: AdminServicesRoute,
});

function AdminServicesRoute() {
  return <AdminServicesPage />;
}
