import { createFileRoute } from '@tanstack/react-router';

import { MasterDashboardPage } from '@/features/master';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.masterDashboard', path: '/master' },
      ],
    });
  },
  component: MasterRoute,
});

function MasterRoute() {
  return <MasterDashboardPage />;
}
