import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { AdminChangesetsPage } from '@/features/admin/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/admin/changesets/')({
  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    status: z.string().optional(),
  }).catch({}),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/admin/changesets');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.adminDashboard', path: '/admin' },
        { titleKey: 'navigation.breadcrumbs.adminChangesets', path: '/admin/changesets' },
      ],
    });
  },
  component: AdminChangesetsRoute,
});

function AdminChangesetsRoute() {
  return <AdminChangesetsPage />;
}
