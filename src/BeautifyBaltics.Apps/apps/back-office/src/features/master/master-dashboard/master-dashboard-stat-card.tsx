import {
  Badge, Card, Group, Stack, Text, ThemeIcon,
} from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';

interface MasterDashboardStatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  iconColor?: string;
}

export function MasterDashboardStatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconColor = 'brand',
}: MasterDashboardStatCardProps) {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'teal';
    if (changeType === 'negative') return 'red';
    return 'gray';
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" align="flex-start">
        <ThemeIcon size="lg" variant="light" color={iconColor} radius="md">
          <Icon size={20} stroke={1.5} />
        </ThemeIcon>
        {change && (
          <Badge
            variant="light"
            color={getChangeColor()}
            size="sm"
            leftSection={<IconTrendingUp size={12} />}
          >
            {change}
          </Badge>
        )}
      </Group>
      <Stack gap={4} mt="md">
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
        <Text fz={28} fw={700}>
          {value}
        </Text>
      </Stack>
    </Card>
  );
}
