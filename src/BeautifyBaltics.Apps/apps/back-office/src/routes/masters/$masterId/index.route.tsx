import { createFileRoute } from '@tanstack/react-router';

import { MasterProfilePage } from '@/features/master-profile';

export const Route = createFileRoute('/masters/$masterId/')({
  beforeLoad: ({ location }) => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.explore', path: '/explore' },
      { titleKey: 'navigation.breadcrumbs.masterProfile', path: location.pathname as '/masters' },
    ],
  }),
  component: MasterProfileRoute,
});

function MasterProfileRoute() {
  const params = Route.useParams();
  return <MasterProfilePage masterId={params.masterId} />;
}
