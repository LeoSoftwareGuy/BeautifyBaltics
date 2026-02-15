import { createFileRoute } from '@tanstack/react-router';

import { MasterServicesPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/services/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/services');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.masterDashboard', path: '/master' },
        { titleKey: 'navigation.breadcrumbs.masterServices', path: '/master/services' },
      ],
    });
  },
  component: MasterServicesRoute,
});

function MasterServicesRoute() {
  return <MasterServicesPage />;
}
