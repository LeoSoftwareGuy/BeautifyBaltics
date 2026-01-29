import { Box, Stack } from '@mantine/core';

import { MasterBookingsDataTable } from '../master-bookings-data-table';

function MasterBookingsPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Stack gap="xl">
        <MasterBookingsDataTable />
      </Stack>
    </Box>
  );
}

export default MasterBookingsPage;
