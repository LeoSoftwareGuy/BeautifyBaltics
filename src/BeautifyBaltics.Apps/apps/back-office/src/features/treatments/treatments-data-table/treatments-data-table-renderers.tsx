import { Stack, Text } from '@mantine/core';

import { AnchorLink } from '@/components/navigation';
import type { FindJobsResponse } from '@/state/endpoints/api.schemas';

export const renderProcedureCell = (job: FindJobsResponse) => (
  <Stack gap={4}>
    <Text fw={600}>{job.name}</Text>
    <Text c="dimmed" size="sm">{job.description ?? 'No description available.'}</Text>
  </Stack>
);

export const renderCategoryCell = (job: FindJobsResponse) => job.categoryName ?? 'Uncategorized';

export const renderDurationCell = (job: FindJobsResponse) => (
  <Text fw={500}>{job.durationMinutes ? `${job.durationMinutes} min` : 'N/A'}</Text>
);

export const renderActionsCell = (job: FindJobsResponse) => (
  <AnchorLink
    to="/explore"
    search={{ procedure: job.id }}
    size="xs"
  >
    Find Masters
  </AnchorLink>
);
