import {
  Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconClock,
  IconCurrencyDollar,
  IconLayoutDashboard,
  IconLogout,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';

import NavigationItem from '../main-navigation/navigation-item';

export default function MasterNavigation() {
  const { logout } = useSession();
  const navigate = useNavigate();
  const layout = useLayout();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login', search: { redirect: '/home', registered: false }, replace: true });
    } catch (error) { /* empty */ }
  };

  return (
    <Stack gap={4}>
      <NavigationItem icon={IconLayoutDashboard} label="Dashboard" href="/master" />
      <NavigationItem icon={IconCalendarEvent} label="Bookings" href="/master/bookings" />
      <NavigationItem icon={IconClock} label="Time Slots" href="/master/time-slots" />
      <NavigationItem icon={IconSparkles} label="Services" href="/master/services" />
      <NavigationItem icon={IconCurrencyDollar} label="Earnings" href="/master/earnings" />
      <NavigationItem icon={IconSettings} label="Settings" href="/master/settings" />

      <UnstyledButton
        onClick={handleLogout}
        px="xs"
        py={8}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <Group gap="xs" wrap="nowrap">
          <IconLogout size={18} color="var(--mantine-color-red-6)" />
          {layout.navbar.collapsed ? null : (
            <Text size="sm" c="red.6">Logout</Text>
          )}
        </Group>
      </UnstyledButton>
    </Stack>
  );
}
