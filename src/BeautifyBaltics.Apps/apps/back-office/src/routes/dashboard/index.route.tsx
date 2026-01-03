import { createFileRoute } from '@tanstack/react-router';

import { DashboardPage } from '@/features/dashboard';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/dashboard');

    return ({
      breadcrumbs: [
        { title: 'Dashboard', path: '/dashboard' },
      ],
    });
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  return <DashboardPage />;
}
