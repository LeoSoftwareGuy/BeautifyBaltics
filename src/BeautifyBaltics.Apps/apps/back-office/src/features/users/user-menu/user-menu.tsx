import {
  Avatar, Group, Menu, Stack, Text,
} from '@mantine/core';
import { IconBell, IconLogout, IconSettings } from '@tabler/icons-react';

import { useSession } from '@/contexts/session-context';

import UserButton from './user-button';

export default function UserMenu() {
  const { user, logout } = useSession();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <Menu shadow="md" width={260} position="right-end">
      <Menu.Target>
        <UserButton name={user.name} email={user.email} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <Group gap="xs" wrap="nowrap" w="100%">
            <Avatar
              td="none"
              name={user.name}
              color="initials"
              size="md"
              radius="md"
              allowedInitialsColors={['gray']}
            />

            <Stack w={170} gap={4}>
              <Text fz="sm" lh={1} truncate="end">{user.name}</Text>
              <Text fz="sm" c="gray" lh={1} truncate="end">{user.email}</Text>
            </Stack>
          </Group>
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
