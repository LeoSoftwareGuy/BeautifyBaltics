import { createFileRoute } from '@tanstack/react-router';

import { MasterProfilePage } from '@/features/master-profile';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/masters/$masterId/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/masters');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.explore', path: '/explore' },
        { titleKey: 'navigation.breadcrumbs.masterProfile', path: location.pathname as '/masters' },
      ],
    });
  },
  component: MasterProfileRoute,
});

function MasterProfileRoute() {
  const params = Route.useParams();
  return <MasterProfilePage masterId={params.masterId} />;
}
