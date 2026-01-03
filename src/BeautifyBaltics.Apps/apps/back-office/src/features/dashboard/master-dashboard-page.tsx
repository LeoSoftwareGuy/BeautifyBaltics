import {
  Box, Container, Stack, Text, Title,
} from '@mantine/core';

function MasterDashboardPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Container size="lg" py="xl">
        <Stack align="center" gap="sm">
          <Title order={2}>Master Dashboard</Title>
          <Text c="dimmed">Soon you will be able to manage your appointments and portfolio here.</Text>
        </Stack>
      </Container>
    </Box>
  );
}

export default MasterDashboardPage;
