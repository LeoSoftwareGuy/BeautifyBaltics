import {
  Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCompass,
  IconDashboard,
  IconHome,
  IconLogout,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';

import NavigationItem from '../main-navigation/navigation-item';

export default function ClientNavigation() {
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
      <NavigationItem icon={IconHome} label="Home" href="/home" />
      <NavigationItem icon={IconDashboard} label="Dashboard" href="/dashboard" />
      <NavigationItem icon={IconCompass} label="Explore" href="/client/explore" />
      <NavigationItem icon={IconCalendarEvent} label="My Bookings" href="/client/bookings" />
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
