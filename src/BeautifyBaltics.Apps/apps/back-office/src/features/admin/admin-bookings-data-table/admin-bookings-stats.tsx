import { useTranslation } from 'react-i18next';
import {
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Skeleton,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCalendarCheck,
  IconCalendarClock,
  IconCalendarStats,
  IconCurrencyEuro,
} from '@tabler/icons-react';

import { useGetBookingStatistics } from '@/state/endpoints/admin';

type StatCardProps = {
  icon: typeof IconCalendarStats;
  label: string;
  value: React.ReactNode;
  isLoading: boolean;
};

function StatCard({
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

export function AdminBookingsStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetBookingStatistics();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      <StatCard
        icon={IconCalendarStats}
        label={t('admin.bookings.stats.totalBookings')}
        value={stats?.totalBookings ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconCalendarCheck}
        label={t('admin.bookings.stats.confirmed')}
        value={stats?.confirmed ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconCalendarClock}
        label={t('admin.bookings.stats.pending')}
        value={stats?.pending ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={IconCurrencyEuro}
        label={t('admin.bookings.stats.revenueThisMonth')}
        value={(
          <NumberFormatter
            value={stats?.revenueThisMonth ?? 0}
            prefix="€"
            decimalScale={2}
            fixedDecimalScale
          />
        )}
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
}
