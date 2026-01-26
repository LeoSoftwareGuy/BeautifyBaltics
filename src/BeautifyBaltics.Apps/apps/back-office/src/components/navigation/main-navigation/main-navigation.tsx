import { Stack } from '@mantine/core';
import {
  IconCookieMan,
  IconDashboard,
  IconSparkles,
} from '@tabler/icons-react';

import NavigationItem from './navigation-item';

export default function MainNavigation() {
  return (
    <Stack gap={4}>
      <NavigationItem icon={IconDashboard} label="Home" href="/" />
      <NavigationItem icon={IconCookieMan} label="Dashboard" href="/dashboard" />
      <NavigationItem icon={IconSparkles} label="Treatments" href="/treatments" />
    </Stack>
  );
}
