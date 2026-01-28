import {
  Box, Grid, Stack, Title,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCurrencyDollar,
  IconStar,
} from '@tabler/icons-react';

import {
  DashboardStatCard,
  EarningsPerformance,
  PendingRequests,
  TodaysSchedule,
} from './master-dashboard';

function MasterDashboardPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>Dashboard</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        {/* Stats Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <DashboardStatCard
              title="Total Bookings"
              value="124"
              change="+12%"
              changeType="positive"
              icon={IconCalendarEvent}
              iconColor="brand"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <DashboardStatCard
              title="Monthly Earnings"
              value="$4,250.00"
              change="+8%"
              changeType="positive"
              icon={IconCurrencyDollar}
              iconColor="brand"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <DashboardStatCard
              title="Average Rating"
              value="4.9/5.0"
              change="+0.2%"
              changeType="positive"
              icon={IconStar}
              iconColor="yellow"
            />
          </Grid.Col>
        </Grid>

        {/* Today's Schedule & Pending Requests */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <TodaysSchedule />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <PendingRequests />
          </Grid.Col>
        </Grid>

        {/* Earnings Performance Chart */}
        <EarningsPerformance />
      </Stack>
    </Box>
  );
}

export default MasterDashboardPage;
