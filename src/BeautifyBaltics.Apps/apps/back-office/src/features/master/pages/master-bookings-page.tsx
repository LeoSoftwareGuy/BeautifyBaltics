import { Box, Stack, Title } from '@mantine/core';

import { MasterBookingsDataTable } from '../master-bookings-data-table';

function MasterBookingsPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>Bookings</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <MasterBookingsDataTable />
      </Stack>
    </Box>
  );
}

export default MasterBookingsPage;
