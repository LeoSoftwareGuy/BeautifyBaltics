import { createFileRoute } from '@tanstack/react-router';

import { MasterTimeSlotsPage } from '@/features/master/pages';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/time-slots/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/time-slots');

    return ({
      breadcrumbs: [
        { title: 'Dashboard', path: '/master' },
        { title: 'Time Slots', path: '/master/time-slots' },
      ],
    });
  },
  component: MasterTimeSlotsRoute,
});

function MasterTimeSlotsRoute() {
  return <MasterTimeSlotsPage />;
}
