import { useTranslation } from 'react-i18next';
import { NumberFormatter, SimpleGrid } from '@mantine/core';
import {
  IconCurrencyEuro,
  IconUserCheck,
  IconUsers,
  IconUserStar,
} from '@tabler/icons-react';

import { StatCard } from '@/components/ui';
import { useGetUserStatistics } from '@/state/endpoints/admin';

export function AdminUsersStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetUserStatistics();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      <StatCard
        icon={IconUsers}
        label={t('admin.users.stats.totalUsers')}
        value={stats?.totalUsers ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconUserStar}
        label={t('admin.users.stats.totalMasters')}
        value={stats?.totalMasters ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconUserCheck}
        label={t('admin.users.stats.totalClients')}
        value={stats?.totalClients ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconCurrencyEuro}
        label={t('admin.users.stats.platformVolume')}
        value={(
          <NumberFormatter
            value={stats?.platformVolume ?? 0}
            prefix="€"
            decimalScale={2}
            fixedDecimalScale
          />
        )}
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
}
