import React from 'react';
import {
  Card, Group, Skeleton, Stack, Text, ThemeIcon,
} from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

interface InsightCardProps {
  title: string;
  icon: typeof IconUsers;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function InsightCard({
  title,
  icon,
  isLoading = false,
  children,
}: InsightCardProps) {
  const IconComponent = icon || IconUsers;
  return (
    <Card withBorder>
      <Group gap="sm" wrap="nowrap">
        <ThemeIcon variant="default" size="lg">
          <IconComponent />
        </ThemeIcon>
        <Stack gap={0}>
          <Text fz="xs" c="gray" lineClamp={1}>{title}</Text>
          {isLoading ? (
            <Skeleton width={120}>
              <Text fz="sm" fw={700}>Loading...</Text>
            </Skeleton>
          ) : <Text fz="sm" fw={700}>{children}</Text>}
        </Stack>
      </Group>
    </Card>
  );
}
