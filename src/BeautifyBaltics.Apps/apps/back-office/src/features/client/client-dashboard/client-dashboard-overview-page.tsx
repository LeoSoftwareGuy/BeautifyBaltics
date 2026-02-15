import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Grid, Stack, Text, Title,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCircleCheck,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

import InsightCard from '@/components/ui/insight-card';
import { BookingStatus } from '@/state/endpoints/api.schemas';
import { useFindBookings } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

import { ClientDashboardNextSession } from './client-dashboard-next-session';
import { ClientDashboardRecentBookings } from './client-dashboard-recent-bookings';

export function ClientDashboardOverviewPage() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const clientId = user?.id ?? '';
  const { t } = useTranslation();

  const { data: allBookingsData, isLoading: isBookingsLoading } = useFindBookings(
    {
      clientId,
      page: 1,
      pageSize: 100,
    },
    {
      query: {
        enabled: !!clientId,
      },
    },
  );

  const upcomingCount = useMemo(
    () => allBookingsData?.items.filter(
      (b) => b.status === BookingStatus.Requested || b.status === BookingStatus.Confirmed,
    ).length ?? 0,
    [allBookingsData?.items],
  );

  const completedCount = useMemo(
    () => allBookingsData?.items.filter((b) => b.status === BookingStatus.Completed).length ?? 0,
    [allBookingsData?.items],
  );

  const totalSpent = useMemo(
    () => allBookingsData?.items
      .filter((b) => b.status === BookingStatus.Completed)
      .reduce((sum, b) => sum + b.price, 0) ?? 0,
    [allBookingsData?.items],
  );

  // Find next upcoming session
  const nextSession = useMemo(() => {
    const now = dayjs();
    const upcomingBookings = allBookingsData?.items
      .filter((b) => (b.status === BookingStatus.Confirmed || b.status === BookingStatus.Requested)
        && dayjs(b.scheduledAt).isAfter(now))
      .sort((a, b) => dayjs(a.scheduledAt).diff(dayjs(b.scheduledAt)));
    return upcomingBookings?.[0];
  }, [allBookingsData?.items]);

  const stats = [
    {
      label: t('client.dashboard.stats.upcoming'),
      value: String(upcomingCount),
      icon: IconCalendarEvent,
      color: 'blue',
    },
    {
      label: t('client.dashboard.stats.completed'),
      value: String(completedCount),
      icon: IconCircleCheck,
      color: 'green',
    },
    {
      label: t('client.dashboard.stats.totalSpent'),
      value: `$${totalSpent.toFixed(2)}`,
      icon: IconCurrencyDollar,
      color: 'grape',
    },
  ];

  const isLoading = isUserLoading || isBookingsLoading;

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Container size="lg">
          <Title order={2}>{t('client.dashboard.title')}</Title>
          <Text c="dimmed" size="sm">{t('client.dashboard.subtitle')}</Text>
        </Container>
      </Box>

      <Container size="lg" pb="xl">
        <Stack gap="xl">
          {/* Stats Cards */}
          <Grid>
            {stats.map((stat) => (
              <Grid.Col key={stat.label} span={{ base: 12, sm: 4 }}>
                <InsightCard title={stat.label} icon={stat.icon} iconColor={stat.color}>
                  <Text size="xl" fw={700} c={stat.color}>{stat.value}</Text>
                </InsightCard>
              </Grid.Col>
            ))}
          </Grid>

          {/* Next Session */}
          <ClientDashboardNextSession
            booking={nextSession}
            isLoading={isLoading}
          />

          {/* Recent Bookings */}
          <ClientDashboardRecentBookings />
        </Stack>
      </Container>
    </Box>
  );
}
