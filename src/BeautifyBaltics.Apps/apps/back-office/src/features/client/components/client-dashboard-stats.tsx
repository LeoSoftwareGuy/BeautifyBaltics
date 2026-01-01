import {
  Card,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { Calendar, Clock } from 'lucide-react';

type DashboardStatsProps = {
  upcomingCount: number;
  completedCount: number;
  totalSpent: number;
};

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card withBorder radius="lg">
      <Card.Section inheritPadding py="md">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Text size="sm" c="dimmed">{label}</Text>
            <Text size="xl" fw={700}>{value}</Text>
          </Stack>
          {icon}
        </Group>
      </Card.Section>
    </Card>
  );
}

function DashboardStats({
  upcomingCount,
  completedCount,
  totalSpent,
}: DashboardStatsProps) {
  return (
    <Group grow align="stretch">
      <StatCard label="Upcoming" value={String(upcomingCount)} icon={<Calendar size={32} />} />
      <StatCard label="Completed" value={String(completedCount)} icon={<Clock size={32} />} />
      <StatCard label="Total Spent" value={`$${totalSpent}`} icon={<Text fw={600}>$</Text>} />
    </Group>
  );
}

export default DashboardStats;
