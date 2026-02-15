import { createFileRoute } from '@tanstack/react-router';

import { MasterTimeSlotsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/time-slots/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/time-slots');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.masterDashboard', path: '/master' },
        { titleKey: 'navigation.breadcrumbs.masterTimeSlots', path: '/master/time-slots' },
      ],
    });
  },
  component: MasterTimeSlotsRoute,
});

function MasterTimeSlotsRoute() {
  return <MasterTimeSlotsPage />;
}
