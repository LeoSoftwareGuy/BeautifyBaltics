import { createFileRoute } from '@tanstack/react-router';

import { ClientExplorePage } from '@/features/client/client-explore';

export const Route = createFileRoute('/top-masters/')({
  beforeLoad: () => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.topMasters', path: '/top-masters' },
    ],
  }),
  component: TopMastersRoute,
});

function TopMastersRoute() {
  return <ClientExplorePage />;
}
