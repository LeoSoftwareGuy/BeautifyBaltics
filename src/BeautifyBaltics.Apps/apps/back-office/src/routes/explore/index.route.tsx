import { createFileRoute } from '@tanstack/react-router';

import { ExplorePage } from '@/features/explore';
import { requireAuthenticated } from '@/utils/auth';

type ExploreSearch = {
  procedure?: string;
};

export const Route = createFileRoute('/explore/')({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    procedure: typeof search.procedure === 'string' ? search.procedure : undefined,
  }),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/explore');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.explore', path: '/explore' },
      ],
    });
  },
  component: ExploreView,
});

function ExploreView() {
  const search = Route.useSearch();
  return <ExplorePage initialProcedureId={search.procedure} />;
}
