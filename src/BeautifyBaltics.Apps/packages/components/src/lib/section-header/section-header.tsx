import React from 'react';
import {
  BoxProps,
  Divider,
  Group, Stack, Text, Title, TitleOrder,
} from '@mantine/core';

interface SectionHeaderProps extends BoxProps {
  title: string;
  leftSection?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  order?: TitleOrder;
  description?: string;
  withDivider?: boolean;
  actions?: React.ReactNode[];
}

export default function SectionHeader({
  title,
  leftSection,
  order = 4,
  variant = 'primary',
  description,
  actions,
  withDivider = false,
  ...props
}: SectionHeaderProps) {
  return (
    <Stack {...props}>
      <Group justify="space-between" align="center" wrap="nowrap">
        <Stack gap={0}>
          <Group gap="xs">
            <Title order={order} fw={variant === 'primary' ? 700 : 500}>{title}</Title>
            {leftSection}
          </Group>
          {description && <Text fz="sm" c="gray">{description}</Text>}
        </Stack>
        <Group gap="sm" wrap="nowrap">
          {actions}
        </Group>
      </Group>
      {withDivider && <Divider />}
    </Stack>
  );
}
