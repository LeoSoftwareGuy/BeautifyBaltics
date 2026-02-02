import {
  Box, Text, Title,
} from '@mantine/core';

import { MasterSchedule } from '../master-schedule';

function MasterTimeSlotsPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>
          Availability Manager
        </Title>
        <Text size="sm" c="dimmed">
          Manage your availability slots. Times shown in your local timezone.
        </Text>
      </Box>
      <MasterSchedule />
    </Box>
  );
}

export default MasterTimeSlotsPage;
