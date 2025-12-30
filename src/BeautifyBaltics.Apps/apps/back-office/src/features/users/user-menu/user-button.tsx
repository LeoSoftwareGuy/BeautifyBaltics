import React, { forwardRef } from 'react';
import {
  Avatar, Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import { useLayout } from '@/layouts';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({
    name, email, icon, ...others
  }: UserButtonProps, ref) => {
    const layout = useLayout();

    return (
      <UnstyledButton ref={ref} {...others} display="flex" w="100%">
        <Group wrap="nowrap">
          <Group gap="xs" align="center" wrap="nowrap" w="100%">
            <Avatar
              td="none"
              name={name}
              color="initials"
              size="md"
              radius="md"
              allowedInitialsColors={['gray']}
            />
            {layout.navbar.collapsed ? null : (
              <Stack w={110} gap={4}>
                <Text fz="sm" lh={1} truncate="end">{name}</Text>
                <Text fz="sm" c="gray" lh={1} truncate="end">{email}</Text>
              </Stack>
            )}
          </Group>
          {layout.navbar.collapsed ? null : <IconChevronRight size={16} />}
        </Group>
      </UnstyledButton>
    );
  },
);

export default UserButton;
