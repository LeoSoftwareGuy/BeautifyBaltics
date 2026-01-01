import { createFileRoute } from '@tanstack/react-router';

import { MasterProfilePage } from '@/features/master-profile';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/$masterId/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master');

    return ({
      breadcrumbs: [
        { title: 'Explore', path: '/explore' },
        { title: 'Master Profile', path: location.pathname as '/master' },
      ],
    });
  },
  component: MasterProfileRoute,
});

function MasterProfileRoute() {
  const params = Route.useParams();
  return <MasterProfilePage masterId={params.masterId} />;
}
