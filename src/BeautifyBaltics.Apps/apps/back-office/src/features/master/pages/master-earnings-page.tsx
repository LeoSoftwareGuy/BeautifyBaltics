import {
  Box, Card, Stack, Text, Title,
} from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';

function MasterEarningsPage() {
  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>Earnings</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <Card withBorder p="xl">
          <Stack align="center" gap="md" py="xl">
            <IconCurrencyDollar size={48} color="var(--mantine-color-gray-5)" />
            <Text size="lg" fw={500} c="dimmed">
              Earnings tracking coming soon
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={400}>
              This page will display your earnings history, payment summaries, and financial reports.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default MasterEarningsPage;
