import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@mantine/core';
import {
  IconBriefcase,
  IconCategory,
} from '@tabler/icons-react';

import { StatCard } from '@/components/ui';
import { useGetServiceStatistics } from '@/state/endpoints/admin';

export function AdminServicesStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetServiceStatistics();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      <StatCard
        icon={IconBriefcase}
        label={t('admin.services.stats.totalServices')}
        value={stats?.totalServices ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconCategory}
        label={t('admin.services.stats.totalCategories')}
        value={stats?.totalCategories ?? 0}
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
}
