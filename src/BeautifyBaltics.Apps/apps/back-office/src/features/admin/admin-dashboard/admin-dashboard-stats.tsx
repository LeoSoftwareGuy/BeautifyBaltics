import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@mantine/core';
import {
  IconCalendarEvent,
  IconScissors,
  IconUsers,
} from '@tabler/icons-react';

import { StatCard } from '@/components/ui';
import { GetDashboardSummaryResponse } from '@/state/endpoints/api.schemas';

type Props = {
  data: GetDashboardSummaryResponse | undefined;
  isLoading: boolean;
};

export function AdminDashboardStats({ data, isLoading }: Props) {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      <StatCard
        icon={IconUsers}
        label={t('admin.dashboard.stats.totalClients')}
        value={data?.totalClients ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconScissors}
        label={t('admin.dashboard.stats.totalMasters')}
        value={data?.totalMasters ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconCalendarEvent}
        label={t('admin.dashboard.stats.totalBookings')}
        value={data?.totalBookings ?? 0}
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
}
