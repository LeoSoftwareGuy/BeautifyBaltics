import {
  Box, Stack, Text, Title,
} from '@mantine/core';

import { MasterServices } from '../master-services/master-services';

function MasterServicesPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>Services Management</Title>
        <Text c="dimmed" size="sm">
          Manage your services and showcase your skills.
        </Text>
      </Box>
      <Stack gap="xl" px="md" pb="xl">
        <MasterServices />
      </Stack>
    </Box>
  );
}

export default MasterServicesPage;
