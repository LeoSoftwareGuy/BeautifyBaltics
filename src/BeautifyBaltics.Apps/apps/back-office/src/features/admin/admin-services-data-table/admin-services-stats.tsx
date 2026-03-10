import { useTranslation } from 'react-i18next';
import {
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Skeleton,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBriefcase,
  IconCategory,
  IconCurrencyEuro,
} from '@tabler/icons-react';

import { useGetServiceStatistics } from '@/state/endpoints/admin';

type StatCardProps = {
  icon: typeof IconBriefcase;
  label: string;
  value: React.ReactNode;
  isLoading: boolean;
};

function StatCard({
  icon: Icon, label, value, isLoading,
}: StatCardProps) {
  return (
    <Card withBorder radius="md" p="lg">
      <Group gap="md">
        <ThemeIcon size="xl" radius="md" variant="light" color="brand">
          <Icon size={22} />
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{label}</Text>
          {isLoading
            ? <Skeleton height={28} width={60} mt={4} />
            : <Text fw={700} size="xl">{value}</Text>}
        </div>
      </Group>
    </Card>
  );
}

export function AdminServicesStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetServiceStatistics();

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
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
      <StatCard
        icon={IconCurrencyEuro}
        label={t('admin.services.stats.averagePrice')}
        value={(
          <NumberFormatter
            value={stats?.averagePrice ?? 0}
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
