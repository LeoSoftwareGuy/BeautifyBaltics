import { Grid, Text } from '@mantine/core';
import {
  IconCalendarEvent,
  IconCircleCheck,
  IconCurrencyDollar,
} from '@tabler/icons-react';

import InsightCard from '@/components/ui/insight-card';

type DashboardStatsProps = {
  upcomingCount: number;
  completedCount: number;
  totalSpent: number;
};

function ClientDashboardStats({
  upcomingCount,
  completedCount,
  totalSpent,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Upcoming',
      value: String(upcomingCount),
      icon: IconCalendarEvent,
      color: 'blue',
    },
    {
      label: 'Completed',
      value: String(completedCount),
      icon: IconCircleCheck,
      color: 'green',
    },
    {
      label: 'Total Spent',
      value: `$${totalSpent}`,
      icon: IconCurrencyDollar,
      color: 'grape',
    },
  ];

  return (
    <Grid>
      {stats.map((stat) => (
        <Grid.Col key={stat.label} span={{ base: 12, md: 4 }}>
          <InsightCard title={stat.label} icon={stat.icon} iconColor={stat.color}>
            <Text size="xl" fw={700} c={stat.color}>{stat.value}</Text>
          </InsightCard>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default ClientDashboardStats;
