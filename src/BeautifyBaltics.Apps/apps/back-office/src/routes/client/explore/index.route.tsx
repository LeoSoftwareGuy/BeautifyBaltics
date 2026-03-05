import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { ClientExplorePage } from '@/features/client/client-explore';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/client/explore/')({
  validateSearch: z.object({
    search: z.string().optional(),
    location: z.string().optional(),
    categoryId: z.string().optional(),
    jobId: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    page: z.number().optional(),
  }).catch({}),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/client/explore');
    return {
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.clientExplore', path: '/client/explore' },
      ],
    };
  },
  component: ClientExploreRoute,
});

function ClientExploreRoute() {
  return <ClientExplorePage />;
}
