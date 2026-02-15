import { createFileRoute } from '@tanstack/react-router';

import { MasterSettingsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/settings/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/settings');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.masterDashboard', path: '/master' },
        { titleKey: 'navigation.breadcrumbs.masterSettings', path: '/master/settings' },
      ],
    });
  },
  component: MasterSettingsRoute,
});

function MasterSettingsRoute() {
  return <MasterSettingsPage />;
}
