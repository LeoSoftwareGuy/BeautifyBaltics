import { useMemo, useState } from 'react';
import { BarChart } from '@mantine/charts';
import {
  Card, Group, Select, Skeleton, Stack, Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { EarningsPeriod, GetEarningsPerformanceResponse } from '@/state/endpoints/api.schemas';

interface MasterDashboardEarningsPerformanceProps {
  data?: GetEarningsPerformanceResponse;
  isLoading?: boolean;
  onPeriodChange?: (period: EarningsPeriod) => void;
}

export function MasterDashboardEarningsPerformance({ data, isLoading, onPeriodChange }: MasterDashboardEarningsPerformanceProps) {
  const [period, setPeriod] = useState<EarningsPeriod>(EarningsPeriod.Monthly);
  const { t } = useTranslation();
  const periodDescriptions = useMemo(() => ({
    [EarningsPeriod.Weekly]: t('master.dashboard.earnings.description.weekly'),
    [EarningsPeriod.Monthly]: t('master.dashboard.earnings.description.monthly'),
    [EarningsPeriod.Yearly]: t('master.dashboard.earnings.description.yearly'),
  }), [t]);

  const handlePeriodChange = (value: string | null) => {
    if (value) {
      const newPeriod = value as EarningsPeriod;
      setPeriod(newPeriod);
      onPeriodChange?.(newPeriod);
    }
  };

  const chartData = data?.data?.map((point) => ({
    label: point.label,
    earnings: point.value,
  })) ?? [];

  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" align="flex-start" mb="xl">
        <Stack gap={4}>
          <Text fw={600} size="lg">{t('master.dashboard.earnings.title')}</Text>
          <Text size="sm" c="dimmed">{periodDescriptions[period]}</Text>
        </Stack>
        <Select
          size="xs"
          value={period}
          onChange={handlePeriodChange}
          data={[
            { value: EarningsPeriod.Weekly, label: t('master.dashboard.earnings.period.weekly') },
            { value: EarningsPeriod.Monthly, label: t('master.dashboard.earnings.period.monthly') },
            { value: EarningsPeriod.Yearly, label: t('master.dashboard.earnings.period.yearly') },
          ]}
          w={100}
        />
      </Group>

      {isLoading ? (
        <Skeleton height={250} />
      ) : (
        <BarChart
          h={250}
          data={chartData}
          dataKey="label"
          series={[{ name: 'earnings', color: 'brand.6' }]}
          tickLine="none"
          gridAxis="y"
          withTooltip
          tooltipAnimationDuration={200}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
        />
      )}
    </Card>
  );
}
