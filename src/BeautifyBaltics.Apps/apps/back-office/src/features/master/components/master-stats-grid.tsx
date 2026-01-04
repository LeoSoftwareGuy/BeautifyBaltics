import { Grid, Text } from '@mantine/core';
import {
  IconCalendarEvent, IconClock, IconCurrencyDollar, IconUser,
} from '@tabler/icons-react';

import InsightCard from '@/components/ui/insight-card';

const stats = [
  {
    label: "Today's Bookings", value: '5', icon: IconCalendarEvent, color: 'blue',
  },
  {
    label: 'This Week', value: '23', icon: IconClock, color: 'green',
  },
  {
    label: 'Revenue', value: '$1,250', icon: IconCurrencyDollar, color: 'grape',
  },
  {
    label: 'Total Clients', value: '127', icon: IconUser, color: 'orange',
  },
];

export function MasterStatsGrid() {
  return (
    <Grid>
      {stats.map((stat) => (
        <Grid.Col key={stat.label} span={{ base: 6, lg: 3 }}>
          <InsightCard title={stat.label} icon={stat.icon as any}>
            <Text fz="xl" fw={700} c={stat.color}>{stat.value}</Text>
          </InsightCard>
        </Grid.Col>
      ))}
    </Grid>
  );
}
