import { createFileRoute } from '@tanstack/react-router';

import { ExplorePage } from '@/features/explore';

type ExploreSearch = {
  procedure?: string;
};

export const Route = createFileRoute('/explore/')({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    procedure: typeof search.procedure === 'string' ? search.procedure : undefined,
  }),
  beforeLoad: () => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.explore', path: '/explore' },
    ],
  }),
  component: ExploreView,
});

function ExploreView() {
  const search = Route.useSearch();
  return <ExplorePage initialProcedureId={search.procedure} />;
}
