import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { ClientExplorePage } from '@/features/client/client-explore';

export const Route = createFileRoute('/top-masters/')({
  validateSearch: z.object({
    search: z.string().optional(),
    location: z.string().optional(),
    categoryId: z.string().optional(),
    jobId: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    page: z.number().optional(),
  }).catch({}),
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
