import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Grid, Skeleton, Stack, Title,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCurrencyDollar,
  IconStar,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { EarningsPeriod } from '@/state/endpoints/api.schemas';
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

function MasterDashboardPage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';
  const { t } = useTranslation();

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

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
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
                icon={IconCurrencyDollar}
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
  );
}

export default MasterDashboardPage;
