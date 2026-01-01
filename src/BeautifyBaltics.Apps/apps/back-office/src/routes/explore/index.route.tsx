import { createFileRoute } from '@tanstack/react-router';

import { ExplorePage } from '@/features/explore';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/explore/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/explore');

    return ({
      breadcrumbs: [
        { title: 'Explore', path: '/explore' },
      ],
    });
  },
  component: ExploreView,
});

function ExploreView() {
  return <ExplorePage />;
}
