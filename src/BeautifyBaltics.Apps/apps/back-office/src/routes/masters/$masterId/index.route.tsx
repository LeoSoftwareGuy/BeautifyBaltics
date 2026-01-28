import { createFileRoute } from '@tanstack/react-router';

import { MasterProfilePage } from '@/features/master-profile';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/masters/$masterId/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/masters');

    return ({
      breadcrumbs: [
        { title: 'Explore', path: '/explore' },
        { title: 'Master Profile', path: location.pathname as '/masters' },
      ],
    });
  },
  component: MasterProfileRoute,
});

function MasterProfileRoute() {
  const params = Route.useParams();
  return <MasterProfilePage masterId={params.masterId} />;
}
