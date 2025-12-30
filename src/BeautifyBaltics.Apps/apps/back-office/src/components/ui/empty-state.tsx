import React from 'react';
import {
  Box, BoxProps, MantineStyleProp, Stack, Text, ThemeIcon,
  Title,
} from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

interface EmptyStateProps extends BoxProps {
  icon?: typeof IconHome;
  pictogram?: React.ReactNode;
  title?: string;
  text: string;
  withBorder?: boolean;
  children?: React.ReactNode;
}

export default function EmptyState({
  icon, pictogram, title, text, withBorder = true, children, ...props
}: EmptyStateProps) {
  const styles: MantineStyleProp = {
    border: withBorder ? '1px dashed var(--mantine-color-gray-4)' : 'none',
    borderRadius: 'var(--mantine-radius-md)',
  };

  const renderIcon = () => {
    if (!icon) return null;
    const Icon = icon;
    return (
      <ThemeIcon size="lg" variant="default">
        <Icon stroke={1.4} />
      </ThemeIcon>
    );
  };

  return (
    <Box {...props}>
      <Box style={styles} p="md" py="xl">
        <Stack align="center" gap="sm">
          <Stack align="center" gap="md">
            {renderIcon()}
            {pictogram}
            <Stack gap={0} align="center">
              {title && <Title order={5}>{title}</Title>}
              <Text fz="xs" c="gray" ta="center">{text}</Text>
            </Stack>
          </Stack>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
