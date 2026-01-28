import {
  Avatar, Group, Stack, Text,
} from '@mantine/core';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';

export default function SidebarFooter() {
  const { user } = useSession();
  const layout = useLayout();

  const displayName = typeof user?.user_metadata?.full_name === 'string'
    ? user?.user_metadata?.full_name
    : user?.email ?? '';
  const displayEmail = user?.email ?? '';

  if (!user) return null;

  return (
    <Stack gap="xs">
      <Group gap="xs" wrap="nowrap" py="xs">
        <Avatar
          name={displayName}
          color="initials"
          size="md"
          radius="md"
          allowedInitialsColors={['blue']}
        />
        {layout.navbar.collapsed ? null : (
          <Stack gap={2}>
            <Text size="sm" fw={500} truncate="end" maw={120}>
              {displayName}
            </Text>
            <Text size="xs" c="dimmed" truncate="end" maw={120}>
              {displayEmail}
            </Text>
          </Stack>
        )}
      </Group>
    </Stack>
  );
}
