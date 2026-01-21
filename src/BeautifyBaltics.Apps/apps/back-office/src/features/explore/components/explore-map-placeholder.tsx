import { Card, Stack, Text } from '@mantine/core';

interface MapPlaceholderProps {
  height?: number | string;
}

function MapPlaceholder({ height = 600 }: MapPlaceholderProps) {
  return (
    <Card radius="lg" withBorder h={height} pos="relative">
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
