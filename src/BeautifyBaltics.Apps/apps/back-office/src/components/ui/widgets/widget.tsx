import {
  Card, Group, Text, ThemeIcon,
} from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

export interface WidgetProps {
  title: string;
  icon: typeof IconUsers;
  actions?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
}

export default function Widget({
  title, icon, actions, width, height, children,
}:WidgetProps) {
  const Icon = icon;

  return (
    <Card withBorder h={height ?? '100%'} w={width ?? '100%'}>
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <ThemeIcon variant="default">
            <Icon />
          </ThemeIcon>
          <Text fw={700} fz="sm">{title}</Text>
        </Group>
        {actions}
      </Group>
      {children}
    </Card>
  );
}
