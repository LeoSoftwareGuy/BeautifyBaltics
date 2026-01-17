import {
  Box, Button, Group, Stack, Title,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import { MasterStatsGrid } from './master-stats-grid';
import { MasterTabs } from './master-tabs';

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
        <MasterTabs />
      </Stack>
    </Box>
  );
}

export default MasterDashboardPage;
