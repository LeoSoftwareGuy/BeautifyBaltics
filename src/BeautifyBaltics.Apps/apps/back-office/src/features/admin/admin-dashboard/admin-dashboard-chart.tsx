import { useTranslation } from 'react-i18next';
import { AreaChart } from '@mantine/charts';
import {
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { MonthlyBookingStat } from '@/state/endpoints/api.schemas';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Props = {
  data: MonthlyBookingStat[] | null | undefined;
  isLoading: boolean;
};

export function AdminDashboardChart({ data, isLoading }: Props) {
  const { t } = useTranslation();

  const chartData = (data ?? []).map((item) => ({
    month: `${MONTH_LABELS[(item.month ?? 1) - 1]} ${item.year}`,
    [t('admin.dashboard.monthlyPerformance.completed')]: item.completed ?? 0,
    [t('admin.dashboard.monthlyPerformance.confirmed')]: item.confirmed ?? 0,
    [t('admin.dashboard.monthlyPerformance.cancelled')]: item.cancelled ?? 0,
  }));

  const completedKey = t('admin.dashboard.monthlyPerformance.completed');
  const confirmedKey = t('admin.dashboard.monthlyPerformance.confirmed');
  const cancelledKey = t('admin.dashboard.monthlyPerformance.cancelled');

  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3} fw={600}>{t('admin.dashboard.monthlyPerformance.title')}</Title>
            <Text c="dimmed" size="sm" mt={4}>{t('admin.dashboard.monthlyPerformance.subtitle')}</Text>
          </div>
          <Group gap="lg">
            <Group gap="xs">
              <div style={{
                width: 12, height: 12, borderRadius: '50%', background: 'var(--mantine-color-brand-6)',
              }}
              />
              <Text size="sm">{completedKey}</Text>
            </Group>
            <Group gap="xs">
              <div style={{
                width: 12, height: 12, borderRadius: '50%', background: 'var(--mantine-color-brand-3)',
              }}
              />
              <Text size="sm">{confirmedKey}</Text>
            </Group>
            <Group gap="xs">
              <div style={{
                width: 12, height: 12, borderRadius: '50%', background: 'var(--mantine-color-gray-4)',
              }}
              />
              <Text size="sm">{cancelledKey}</Text>
            </Group>
          </Group>
        </Group>

        {isLoading ? (
          <Skeleton height={300} radius="md" />
        ) : (
          <AreaChart
            h={300}
            data={chartData}
            dataKey="month"
            series={[
              { name: completedKey, color: 'brand.6' },
              { name: confirmedKey, color: 'brand.3' },
              { name: cancelledKey, color: 'gray.4' },
            ]}
            curveType="monotone"
            withLegend={false}
            withDots={false}
            fillOpacity={0.15}
          />
        )}
      </Stack>
    </Card>
  );
}
