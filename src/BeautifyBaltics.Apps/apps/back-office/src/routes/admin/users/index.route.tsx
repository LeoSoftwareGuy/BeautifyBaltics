import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { AdminUsersPage } from '@/features/admin/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/admin/users/')({
  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    sortBy: z.string().optional(),
    ascending: z.boolean().optional(),
    search: z.string().optional(),
    role: z.string().optional(),
  }).catch({}),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/admin/users');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.adminDashboard', path: '/admin' },
        { titleKey: 'navigation.breadcrumbs.adminUsers', path: '/admin/users' },
      ],
    });
  },
  component: AdminUsersRoute,
});

function AdminUsersRoute() {
  return <AdminUsersPage />;
}
