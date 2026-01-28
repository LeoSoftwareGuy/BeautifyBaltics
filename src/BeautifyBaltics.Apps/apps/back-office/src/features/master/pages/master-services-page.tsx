import { Box, Stack, Title } from '@mantine/core';

import { MasterTreatments } from '../master-treatments/master-treatments';

function MasterServicesPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>Services</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <MasterTreatments />
      </Stack>
    </Box>
  );
}

export default MasterServicesPage;
