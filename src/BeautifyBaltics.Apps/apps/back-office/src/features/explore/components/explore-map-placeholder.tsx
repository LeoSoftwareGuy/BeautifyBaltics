import { Card, Stack, Text } from '@mantine/core';

function MapPlaceholder() {
  return (
    <Card radius="lg" withBorder h={600} pos="relative">
      <Stack justify="center" align="center" h="100%">
        <Text c="dimmed">Map view coming soon</Text>
        <Text size="sm" c="dimmed">
          Select a master to highlight them on the map
        </Text>
      </Stack>
    </Card>
  );
}

export default MapPlaceholder;
