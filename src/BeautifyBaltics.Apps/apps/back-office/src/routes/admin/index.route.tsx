import { createFileRoute } from '@tanstack/react-router';

import { AdminDashboardPage } from '@/features/admin/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/admin/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/admin');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.adminDashboard', path: '/admin' },
      ],
    });
  },
  component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
  return <AdminDashboardPage />;
}
