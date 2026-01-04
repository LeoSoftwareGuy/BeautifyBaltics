import {
  Card, Group, Stack, Text, ThemeIcon,
} from '@mantine/core';

interface InsightCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  iconColor?: string;
  children: React.ReactNode;
}

export default function InsightCard({
  title, icon: Icon, iconColor = 'blue', children,
}: InsightCardProps) {
  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" align="flex-start" mb="xs">
        <Stack gap={4}>
          <Text size="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          {children}
        </Stack>
        <ThemeIcon size="lg" variant="light" color={iconColor} radius="md">
          <Icon size={20} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}
