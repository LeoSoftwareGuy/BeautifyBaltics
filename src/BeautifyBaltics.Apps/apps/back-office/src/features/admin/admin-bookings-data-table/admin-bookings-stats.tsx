import { useTranslation } from 'react-i18next';
import { NumberFormatter, SimpleGrid } from '@mantine/core';
import {
  IconCalendarCheck,
  IconCalendarClock,
  IconCalendarStats,
  IconCurrencyEuro,
} from '@tabler/icons-react';

import { StatCard } from '@/components/ui';
import { useGetBookingStatistics } from '@/state/endpoints/admin';

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
