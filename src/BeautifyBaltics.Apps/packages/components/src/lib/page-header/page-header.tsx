import React from 'react';
import {
  Divider, Group, Stack, useMantineTheme,
} from '@mantine/core';

interface PageHeaderProps {
  title: string | React.ReactNode;
  actions?: React.ReactNode | React.ReactNode[];
  withDivider?: boolean;
}

export default function PageHeader({
  title, actions, withDivider = true,
}: PageHeaderProps) {
  const theme = useMantineTheme();

  return (
    <Stack gap={0} bg="white">
      <Group h={theme.other.pageHeader.height} justify="space-between" py="xs" px="md" wrap="nowrap">
        {title}
        <Group gap="sm" wrap="nowrap">
          {actions}
        </Group>
      </Group>
      {withDivider ? <Divider /> : null}
    </Stack>
  );
}
