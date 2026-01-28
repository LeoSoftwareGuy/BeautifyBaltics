import { createFileRoute } from '@tanstack/react-router';

import { MasterServicesPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/services/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/services');

    return ({
      breadcrumbs: [
        { title: 'Dashboard', path: '/master' },
        { title: 'Services', path: '/master/services' },
      ],
    });
  },
  component: MasterServicesRoute,
});

function MasterServicesRoute() {
  return <MasterServicesPage />;
}
