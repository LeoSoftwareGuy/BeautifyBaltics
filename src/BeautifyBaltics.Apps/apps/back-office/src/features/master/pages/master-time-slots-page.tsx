import { Box, Stack, Title } from '@mantine/core';

import { MasterSchedule } from '../master-schedule';

function MasterTimeSlotsPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>Time Slots</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <MasterSchedule />
      </Stack>
    </Box>
  );
}

export default MasterTimeSlotsPage;
