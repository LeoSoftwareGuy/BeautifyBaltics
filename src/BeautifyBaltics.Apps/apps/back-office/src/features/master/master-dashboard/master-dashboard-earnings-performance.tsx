import { useState } from 'react';
import { BarChart } from '@mantine/charts';
import {
  Card, Group, Select, Skeleton, Stack, Text,
} from '@mantine/core';

import { EarningsPeriod, GetEarningsPerformanceResponse } from '@/state/endpoints/api.schemas';

interface MasterDashboardEarningsPerformanceProps {
  data?: GetEarningsPerformanceResponse;
  isLoading?: boolean;
  onPeriodChange?: (period: EarningsPeriod) => void;
}

const periodDescriptions: Record<EarningsPeriod, string> = {
  [EarningsPeriod.Weekly]: 'Revenue overview for the last 7 days',
  [EarningsPeriod.Monthly]: 'Revenue overview for the last 12 months',
  [EarningsPeriod.Yearly]: 'Revenue overview for the last 5 years',
};

export function MasterDashboardEarningsPerformance({ data, isLoading, onPeriodChange }: MasterDashboardEarningsPerformanceProps) {
  const [period, setPeriod] = useState<EarningsPeriod>(EarningsPeriod.Monthly);

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
          <Text fw={600} size="lg">Earnings Performance</Text>
          <Text size="sm" c="dimmed">{periodDescriptions[period]}</Text>
        </Stack>
        <Select
          size="xs"
          value={period}
          onChange={handlePeriodChange}
          data={[
            { value: EarningsPeriod.Weekly, label: 'Weekly' },
            { value: EarningsPeriod.Monthly, label: 'Monthly' },
            { value: EarningsPeriod.Yearly, label: 'Yearly' },
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
