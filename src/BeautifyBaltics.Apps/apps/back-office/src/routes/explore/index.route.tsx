import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { ExplorePage } from '@/features/explore';

export const Route = createFileRoute('/explore/')({
  validateSearch: z.object({
    procedure: z.string().optional(),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
  }).catch({}),
  beforeLoad: () => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.explore', path: '/explore' },
    ],
  }),
  component: ExploreView,
});

function ExploreView() {
  return <ExplorePage />;
}
