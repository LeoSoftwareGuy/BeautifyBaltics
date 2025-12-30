import { Stack } from '@mantine/core';
import { IconSettings, IconTerminal2 } from '@tabler/icons-react';

import NavigationItem from './navigation-item';

export default function SecondaryNavigation() {
  return (
    <Stack gap={4}>
      <NavigationItem icon={IconTerminal2} label="Console" href="/console" />
      <NavigationItem icon={IconSettings} label="Settings" href="/settings" />
    </Stack>
  );
}
