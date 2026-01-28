import { createFileRoute } from '@tanstack/react-router';

import { MasterEarningsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/earnings/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/earnings');

    return ({
      breadcrumbs: [
        { title: 'Dashboard', path: '/master' },
        { title: 'Earnings', path: '/master/earnings' },
      ],
    });
  },
  component: MasterEarningsRoute,
});

function MasterEarningsRoute() {
  return <MasterEarningsPage />;
}
