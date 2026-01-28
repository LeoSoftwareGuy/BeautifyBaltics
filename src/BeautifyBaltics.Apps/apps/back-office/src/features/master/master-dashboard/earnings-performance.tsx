import { BarChart } from '@mantine/charts';
import {
  Card, Group, Select, Stack, Text,
} from '@mantine/core';

const earningsData = [
  { day: '1', earnings: 1200 },
  { day: '5', earnings: 1800 },
  { day: '10', earnings: 1400 },
  { day: '15', earnings: 2200 },
  { day: '20', earnings: 1900 },
  { day: '25', earnings: 2800 },
  { day: '30', earnings: 2400 },
];

export function EarningsPerformance() {
  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" align="flex-start" mb="xl">
        <Stack gap={4}>
          <Text fw={600} size="lg">Earnings Performance</Text>
          <Text size="sm" c="dimmed">Revenue overview for the last 30 days</Text>
        </Stack>
        <Select
          size="xs"
          defaultValue="monthly"
          data={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
          w={100}
        />
      </Group>

      <BarChart
        h={250}
        data={earningsData}
        dataKey="day"
        series={[{ name: 'earnings', color: 'brand.6' }]}
        tickLine="none"
        gridAxis="y"
        withTooltip
        tooltipAnimationDuration={200}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
      />
    </Card>
  );
}
