import {
  Card,
  Group,
  Skeleton,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

export type StatCardProps = {
  icon: typeof IconStar;
  label: string;
  value: React.ReactNode;
  isLoading: boolean;
};

export function StatCard({
  icon: Icon, label, value, isLoading,
}: StatCardProps) {
  return (
    <Card withBorder radius="md" p="lg">
      <Group gap="md">
        <ThemeIcon size="xl" radius="md" variant="light" color="brand">
          <Icon size={22} />
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{label}</Text>
          {isLoading
            ? <Skeleton height={28} width={60} mt={4} />
            : <Text fw={700} size="xl">{value}</Text>}
        </div>
      </Group>
    </Card>
  );
}
