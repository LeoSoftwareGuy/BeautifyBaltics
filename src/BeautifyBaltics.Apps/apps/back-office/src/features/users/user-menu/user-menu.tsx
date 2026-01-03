import {
  Avatar, Group, Menu, Stack, Text,
} from '@mantine/core';
import { IconBell, IconLogout, IconSettings } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';

import UserButton from './user-button';

export default function UserMenu() {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  const displayName = typeof user?.user_metadata?.full_name === 'string'
    ? user?.user_metadata?.full_name
    : user?.email ?? 'Beautify Baltics user';
  const displayEmail = user?.email ?? '';

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login', search: { redirect: '/home', registered: false }, replace: true });
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  if (!user) return null;

  return (
    <Menu shadow="md" width={260} position="right-end">
      <Menu.Target>
        <UserButton name={displayName} email={displayEmail} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <Group gap="xs" wrap="nowrap" w="100%">
            <Avatar
              td="none"
              name={displayName}
              color="initials"
              size="md"
              radius="md"
              allowedInitialsColors={['gray']}
            />

            <Stack w={170} gap={4}>
              <Text fz="sm" lh={1} truncate="end">{displayName}</Text>
              <Text fz="sm" c="gray" lh={1} truncate="end">{displayEmail}</Text>
            </Stack>
          </Group>
        </Menu.Item>
        <Menu.Item onClick={() => navigate({ to: '/dashboard' })}>
          <Stack gap={2}>
            <Text fw={600} fz="sm">My Dashboard</Text>
            <Text fz="xs" c="dimmed">{displayEmail}</Text>
          </Stack>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item disabled leftSection={<IconSettings size={16} />}>Settings</Menu.Item>
        <Menu.Item disabled leftSection={<IconBell size={16} />}>Notifications</Menu.Item>
        <Menu.Divider />
        <Menu.Item component="a" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
