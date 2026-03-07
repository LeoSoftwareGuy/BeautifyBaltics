import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Box,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  IconBell,
  IconCalendarEvent,
  IconChevronRight,
  IconCurrencyEuro,
  IconStar,
  IconTrendingUp,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { useTranslateData } from '@/hooks/use-translate-data';
import { BookingStatus, EarningsPeriod } from '@/state/endpoints/api.schemas';
import { useCancelBooking, useConfirmBooking, useFindBookings } from '@/state/endpoints/bookings';
import {
  getGetPendingRequestsQueryKey,
  useGetDashboardStats,
  useGetEarningsPerformance,
  useGetPendingRequests,
} from '@/state/endpoints/masters';
import { useGetMasterRatings } from '@/state/endpoints/ratings';
import { useGetUser } from '@/state/endpoints/users';

import {
  MasterDashboardEarningsPerformance,
  MasterDashboardPendingRequests,
  MasterDashboardStatCard,
  MasterDashboardTodaysSchedule,
} from './master-dashboard';

function formatDuration(duration: string): string {
  const parts = duration.split(':');
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
  }
  return duration;
}

function MasterDashboardPage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { translateService } = useTranslateData();

  const [earningsPeriod, setEarningsPeriod] = useState<EarningsPeriod>(EarningsPeriod.Monthly);

  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStats(masterId, {
    query: { enabled: !!masterId },
  });

  const { data: earningsData, isLoading: isEarningsLoading } = useGetEarningsPerformance(
    masterId,
    { masterId, period: earningsPeriod },
    { query: { enabled: !!masterId } },
  );

  const { data: pendingData, isLoading: isPendingLoading } = useGetPendingRequests(masterId, {
    query: { enabled: !!masterId },
  });

  const { data: ratingsData, isLoading: isRatingsLoading } = useGetMasterRatings(
    masterId,
    { masterId, page: 1, pageSize: 100 },
    { query: { enabled: !!masterId } },
  );

  const today = dayjs();
  const { data: todayBookingsData, isLoading: isTodayBookingsLoading } = useFindBookings(
    {
      masterId,
      from: today.startOf('day').toDate(),
      to: today.endOf('day').toDate(),
    },
    { query: { enabled: !!masterId } },
  );

  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPendingRequestsQueryKey(masterId) });
      },
    },
  });

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPendingRequestsQueryKey(masterId) });
      },
    },
  });

  const handleConfirmBooking = (bookingId: string) => {
    confirmBooking({ id: bookingId, data: { bookingId, masterId } });
  };

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking({ id: bookingId, data: { bookingId, masterId } });
  };

  const formatChange = (change: number | undefined): string => {
    if (change === undefined) return '';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '$0.00';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isLoading = isUserLoading || isStatsLoading || isRatingsLoading;

  const ratings = ratingsData?.items ?? [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
    : 0;
  const ratingCount = ratingsData?.totalItemCount ?? 0;

  const sortedTodayBookings = useMemo(
    () => (todayBookingsData?.items ?? [])
      .filter((b) => b.status !== BookingStatus.Cancelled)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [todayBookingsData?.items],
  );

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">

      {/* ── MOBILE LAYOUT ── */}
      <Box hiddenFrom="md">
        {/* Stats grid */}
        <Box px="md" pt="lg">
          <Title order={3} style={{ fontFamily: '"Playfair Display", serif' }} mb="md">
            {t('master.dashboard.title')}
          </Title>

          <SimpleGrid cols={2} spacing="sm">
            {/* Total Bookings */}
            <Box
              p="md"
              style={{ borderRadius: 12, backgroundColor: 'var(--mantine-color-pink-0)', border: '1px solid var(--mantine-color-pink-1)' }}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
                {t('master.dashboard.stats.totalBookings')}
              </Text>
              {isLoading ? <Skeleton height={36} mt={4} /> : (
                <>
                  <Text fz={28} fw={700} lh={1} mt={4}>
                    {statsData?.totalBookings?.toLocaleString() ?? '0'}
                  </Text>
                  {statsData?.totalBookingsChange !== undefined && (
                    <Group gap={4} mt={4}>
                      <IconTrendingUp size={14} color="var(--mantine-color-teal-6)" />
                      <Text size="xs" fw={700} c="teal">{formatChange(statsData.totalBookingsChange)}</Text>
                    </Group>
                  )}
                </>
              )}
            </Box>

            {/* Avg Rating */}
            <Box
              p="md"
              style={{ borderRadius: 12, backgroundColor: 'var(--mantine-color-pink-0)', border: '1px solid var(--mantine-color-pink-1)' }}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
                {t('master.dashboard.stats.averageRating')}
              </Text>
              {isLoading ? <Skeleton height={36} mt={4} /> : (
                <>
                  <Text fz={28} fw={700} lh={1} mt={4}>
                    {ratingCount > 0 ? averageRating.toFixed(1) : '—'}
                  </Text>
                  <Group gap={4} mt={4}>
                    <IconStar size={14} color="var(--mantine-color-teal-6)" />
                    <Text size="xs" fw={700} c="teal">
                      {ratingCount > 0 ? t('master.dashboard.stats.reviewsLabel', { count: ratingCount }) : t('master.dashboard.stats.noRatings')}
                    </Text>
                  </Group>
                </>
              )}
            </Box>
          </SimpleGrid>

          {/* Monthly Income — full-width pink card */}
          <Box
            mt="sm"
            p="md"
            style={{ borderRadius: 12, backgroundColor: 'var(--mantine-color-pink-6)' }}
          >
            <Group justify="space-between" align="center">
              <div>
                <Text size="xs" fw={600} tt="uppercase" style={{ letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>
                  {t('master.dashboard.stats.monthlyEarnings')}
                </Text>
                {isLoading ? <Skeleton height={36} mt={4} /> : (
                  <Text fz={28} fw={700} lh={1} mt={4} c="white">
                    {formatCurrency(statsData?.monthlyEarningsAverage)}
                  </Text>
                )}
              </div>
              <ThemeIcon size={44} radius="md" color="pink" variant="filled">
                <IconCurrencyEuro size={22} />
              </ThemeIcon>
            </Group>
          </Box>
        </Box>

        {/* Pending Requests banner */}
        {(pendingData?.totalCount ?? 0) > 0 && (
          <Box px="md" mt="md">
            <UnstyledButton style={{ width: '100%' }} onClick={() => navigate({ to: '/master/bookings' })}>
              <Box
                p="md"
                style={{
                  borderRadius: 12,
                  backgroundColor: 'var(--mantine-color-pink-0)',
                  border: '1px solid var(--mantine-color-pink-2)',
                }}
              >
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <ThemeIcon size={40} radius="xl" color="pink" variant="filled">
                      <IconBell size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={700} size="sm" lh={1}>{t('master.dashboard.pendingRequests.title')}</Text>
                      <Text size="xs" c="dimmed" mt={4}>
                        {t('master.dashboard.mobile.actionRequired', { count: pendingData?.totalCount ?? 0 })}
                      </Text>
                    </div>
                  </Group>
                  <Text fz={20} fw={700} c="pink">{pendingData?.totalCount}</Text>
                </Group>
              </Box>
            </UnstyledButton>
          </Box>
        )}

        {/* Today's schedule */}
        <Box px="md" mt="xl">
          <Group justify="space-between" mb="md">
            <Title order={4} style={{ fontFamily: '"Playfair Display", serif' }}>
              {t('master.dashboard.schedule.title')}
            </Title>
            <Anchor component={Link} to="/master/time-slots" size="sm" c="brand" fw={700}>
              {t('master.dashboard.mobile.viewAll')}
            </Anchor>
          </Group>

          {isTodayBookingsLoading && (
            <Stack gap="sm">
              {[1, 2].map((i) => <Skeleton key={i} height={68} radius="lg" />)}
            </Stack>
          )}
          {!isTodayBookingsLoading && sortedTodayBookings.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" py="md">{t('master.dashboard.schedule.empty')}</Text>
          )}
          {!isTodayBookingsLoading && sortedTodayBookings.length > 0 && (
            <Stack gap="sm">
              {sortedTodayBookings.slice(0, 5).map((booking, idx) => (
                <Paper
                  key={booking.id}
                  p="sm"
                  radius="lg"
                  style={{ border: '1px solid var(--mantine-color-gray-1)', backgroundColor: 'white' }}
                >
                  <Group gap="md" wrap="nowrap">
                    <Box ta="center" style={{ minWidth: 50 }}>
                      <Text size="xs" fw={700} c="dimmed">{dayjs(booking.scheduledAt).format('HH:mm')}</Text>
                      <Box
                        mx="auto"
                        mt={4}
                        style={{
                          width: 4,
                          height: 32,
                          borderRadius: 4,
                          backgroundColor: idx === 0
                            ? 'var(--mantine-color-pink-5)'
                            : 'var(--mantine-color-pink-2)',
                        }}
                      />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={700}>
                        {booking.clientName}
                        {' — '}
                        {translateService(booking.masterJobTitle)}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2}>{formatDuration(booking.duration)}</Text>
                    </Box>
                    <IconChevronRight size={18} color="var(--mantine-color-gray-4)" />
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        {/* Income dynamics */}
        <Box px="md" mt="xl" pb="xl">
          <Title order={4} style={{ fontFamily: '"Playfair Display", serif' }} mb="md">
            {t('master.dashboard.mobile.incomeDynamics')}
          </Title>
          <MasterDashboardEarningsPerformance
            data={earningsData}
            isLoading={isEarningsLoading}
            onPeriodChange={setEarningsPeriod}
          />
        </Box>
      </Box>

      {/* ── DESKTOP LAYOUT ── */}
      <Box visibleFrom="md">
        <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
          <Title order={2}>{t('master.dashboard.title')}</Title>
        </Box>

        <Stack gap="xl" px="md" pb="xl">
          {/* Stats Cards */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              {isLoading ? (
                <Skeleton height={120} radius="md" />
              ) : (
                <MasterDashboardStatCard
                  title={t('master.dashboard.stats.totalBookings')}
                  value={statsData?.totalBookings?.toString() ?? '0'}
                  change={formatChange(statsData?.totalBookingsChange)}
                  changeType={statsData?.totalBookingsChange && statsData.totalBookingsChange >= 0 ? 'positive' : 'negative'}
                  icon={IconCalendarEvent}
                  iconColor="brand"
                />
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              {isLoading ? (
                <Skeleton height={120} radius="md" />
              ) : (
                <MasterDashboardStatCard
                  title={t('master.dashboard.stats.monthlyEarnings')}
                  value={formatCurrency(statsData?.monthlyEarningsAverage)}
                  change={formatChange(statsData?.monthlyEarningsChange)}
                  changeType={statsData?.monthlyEarningsChange && statsData.monthlyEarningsChange >= 0 ? 'positive' : 'negative'}
                  icon={IconCurrencyEuro}
                  iconColor="brand"
                />
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              {isLoading ? (
                <Skeleton height={120} radius="md" />
              ) : (
                <MasterDashboardStatCard
                  title={t('master.dashboard.stats.averageRating')}
                  value={ratingCount > 0 ? `${averageRating.toFixed(1)}/5.0` : t('master.dashboard.stats.noRatings')}
                  change={ratingCount > 0 ? t('master.dashboard.stats.reviewsLabel', { count: ratingCount }) : ''}
                  changeType="positive"
                  icon={IconStar}
                  iconColor="yellow"
                />
              )}
            </Grid.Col>
          </Grid>

          {/* Today's Schedule & Pending Requests */}
          <Grid>
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <MasterDashboardTodaysSchedule
                bookings={todayBookingsData?.items}
                isLoading={isTodayBookingsLoading}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <MasterDashboardPendingRequests
                data={pendingData}
                isLoading={isPendingLoading}
                isConfirming={isConfirming}
                isCancelling={isCancelling}
                onConfirm={handleConfirmBooking}
                onCancel={handleCancelBooking}
              />
            </Grid.Col>
          </Grid>

          {/* Earnings Performance Chart */}
          <MasterDashboardEarningsPerformance
            data={earningsData}
            isLoading={isEarningsLoading}
            onPeriodChange={setEarningsPeriod}
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default MasterDashboardPage;
