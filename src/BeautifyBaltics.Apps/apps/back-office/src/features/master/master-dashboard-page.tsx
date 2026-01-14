import {
  Box, Button, Group, Stack, Title,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import { MasterStatsGrid } from './components/master-stats-grid';
import { MasterTabs } from './components/master-tabs';

const defaultBookings = [
  {
    id: 1, client: 'Sarah Johnson', service: 'Haircut', time: '10:00 AM', date: 'Today', status: 'confirmed',
  },
  {
    id: 2, client: 'Mike Brown', service: 'Beard Trim', time: '2:00 PM', date: 'Today', status: 'confirmed',
  },
  {
    id: 3, client: 'Emma Davis', service: 'Hair Color', time: '11:00 AM', date: 'Tomorrow', status: 'pending',
  },
];

function MasterDashboardPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Group justify="space-between">
          <Title order={2}>Master Dashboard</Title>
          <Button leftSection={<IconSettings size={16} />}>Settings</Button>
        </Group>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <MasterStatsGrid />
        <MasterTabs bookings={defaultBookings} />
      </Stack>
    </Box>
  );
}

export default MasterDashboardPage;
