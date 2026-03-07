import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Box, Container, Grid, Group, ScrollArea, Stack, Text, Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconCircleCheck,
  IconCurrencyEuro,
  IconPlus,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';

import InsightCard from '@/components/ui/insight-card';
import { BookingStatus } from '@/state/endpoints/api.schemas';
import { useFindBookings } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

import { ClientBookingsDataTable } from '../client-bookings-data-table/client-bookings-data-table';

import { ClientDashboardNextSession } from './client-dashboard-next-session';
import { ClientDashboardRecentBookings } from './client-dashboard-recent-bookings';

export function ClientDashboardOverviewPage() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const clientId = user?.id ?? '';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 62em)');

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
      icon: IconCurrencyEuro,
      color: 'grape',
    },
  ];

  const isLoading = isUserLoading || isBookingsLoading;

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      {/* Mobile header */}
      <Box
        hiddenFrom="md"
        pos="sticky"
        top={0}
        bg="var(--mantine-color-body)"
        style={{ zIndex: 100, borderBottom: '1px solid #f1f5f9' }}
        px="md"
        pt="lg"
        pb="md"
      >
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2} style={{ fontFamily: '"Playfair Display", serif' }}>
              {t('client.bookings.headerTitle')}
            </Title>
            {user?.fullName && (
              <Text c="dimmed" size="sm" mt={4}>
                Hi,
                {' '}
                {user.fullName.split(' ')[0]}
                !
              </Text>
            )}
          </div>
          <ActionIcon
            size={52}
            radius="xl"
            color="pink"
            variant="filled"
            style={{ boxShadow: '0 4px 12px rgba(216,85,122,0.3)', flexShrink: 0 }}
            onClick={() => navigate({ to: '/explore' })}
            aria-label={t('client.bookings.bookCta')}
          >
            <IconPlus size={24} />
          </ActionIcon>
        </Group>

        {/* Mobile stats strip */}
        <ScrollArea type="never" mt="md" mx={-16}>
          <Group gap="sm" px="md" wrap="nowrap" pb={4}>
            {stats.map((stat) => (
              <Box
                key={stat.label}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '10px 16px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                  minWidth: 100,
                }}
              >
                <Text size="xs" c="dimmed" fw={500}>{stat.label}</Text>
                <Text fw={700} size="lg">{stat.value}</Text>
              </Box>
            ))}
          </Group>
        </ScrollArea>
      </Box>

      {/* Desktop header */}
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Container size="lg">
          <Title order={2}>{t('client.dashboard.title')}</Title>
          <Text c="dimmed" size="sm">{t('client.dashboard.subtitle')}</Text>
        </Container>
      </Box>

      <Container size="lg" pb="xl" pt={{ base: 'md', md: 0 }}>
        <Stack gap="xl">
          {/* Desktop stats cards */}
          <Grid visibleFrom="md">
            {stats.map((stat) => (
              <Grid.Col key={stat.label} span={4}>
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

          {/* Bookings: cards on mobile, table on desktop */}
          {isMobile ? <ClientBookingsDataTable /> : <ClientDashboardRecentBookings />}
        </Stack>
      </Container>
    </Box>
  );
}
