import {
  Box, Card, Stack, Title,
} from '@mantine/core';

import MasterProfileSettings from '../master-profile-settings';

function MasterSettingsPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>Settings</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <Card withBorder>
          <MasterProfileSettings />
        </Card>
      </Stack>
    </Box>
  );
}

export default MasterSettingsPage;
