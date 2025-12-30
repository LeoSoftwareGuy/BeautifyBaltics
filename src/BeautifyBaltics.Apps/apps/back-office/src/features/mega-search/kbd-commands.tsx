import {
  Flex, Group, Kbd, Text,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconCornerDownLeft } from '@tabler/icons-react';

export default function KbdCommands() {
  const renderKbd = (icon: typeof IconArrowUp) => {
    const Icon = icon;
    return (
      <Kbd size="xs" bg="white">
        <Flex align="center" justify="center" h={16} w={12}>
          <Icon />
        </Flex>
      </Kbd>
    );
  };

  return (
    <Group justify="space-between">
      <Group gap="xs">
        <Group gap={4}>
          {renderKbd(IconArrowUp)}
          {renderKbd(IconArrowDown)}
        </Group>
        <Text fz="xs" c="dark">to navigate</Text>
      </Group>
      <Group gap="xs">
        <Text fz="xs" c="dark">to select</Text>
        {renderKbd(IconCornerDownLeft)}
      </Group>
    </Group>
  );
}
