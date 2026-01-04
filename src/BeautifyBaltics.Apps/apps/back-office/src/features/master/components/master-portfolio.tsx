import {
  Button, Card, Stack, Text, Title,
} from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

export function MasterPortfolioPanel() {
  return (
    <Card withBorder radius="md">
      <Stack gap="lg">
        <div>
          <Title order={3}>Portfolio</Title>
          <Text c="dimmed" fz="sm">  Showcase your work to attract more clients</Text>
        </div>

        <Stack gap="md" align="center" py="xl">
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            border: '2px solid var(--mantine-color-gray-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--mantine-color-gray-0)',
          }}
          >
            <IconPhoto size={40} stroke={1.5} color="var(--mantine-color-gray-5)" />
          </div>

          <Text c="dimmed" size="sm">
            Portfolio management coming soon
          </Text>

          <Button color="pink" size="md">
            Upload Images
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
