import { createFileRoute } from '@tanstack/react-router';

import { ClientExplorePage } from '@/features/client/client-explore';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/client/explore/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/client/explore');
    return {
      breadcrumbs: [
        { title: 'Explore', path: '/client/explore' },
      ],
    };
  },
  component: ClientExploreRoute,
});

function ClientExploreRoute() {
  return <ClientExplorePage />;
}
