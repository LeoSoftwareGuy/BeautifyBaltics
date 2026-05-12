import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  Card, Stack, Text, Title,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

import { useTranslateData } from '@/hooks/use-translate-data';
import {
  BookingStatus,
  FindBookingsParams,
  FindBookingsResponse,
  FindBookingsResponsePagedResponse,
} from '@/state/endpoints/api.schemas';
import {
  getFindBookingsQueryKey,
  useCancelBooking,
  useFindBookings,
  useForceCompleteBooking,
} from '@/state/endpoints/bookings';
import { useFindRatings } from '@/state/endpoints/ratings';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import { ClientBookingsDataTableFilters } from '../client-bookings-data-table/client-bookings-data-table-filters';
import {
  BookingActionsRenderer,
  BookingStatusBadge,
  renderDuration,
  renderPrice,
  renderScheduledAt,
} from '../client-bookings-data-table/client-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 5;

type BookingsQuery = FindBookingsParams;

export function ClientDashboardRecentBookings() {
  const { data: user } = useGetUser();
  const clientId = user?.id ?? '';
  const { t } = useTranslation();
  const { translateService } = useTranslateData();
  const queryClient = useQueryClient();

  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [status, setStatus] = useState<string>('');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const {
    query,
    sortStatus,
    onPageChange,
    onRecordsPerPageChange,
    handleSortStatusChange,
  } = usePagedTableQuery<BookingsQuery, FindBookingsResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'scheduledAt',
    ascending: false,
  }, false);

  const {
    data: bookingsData,
    isLoading,
  } = useFindBookings(
    {
      clientId,
      page: query.page,
      pageSize: query.pageSize,
      sortBy: query.sortBy,
      ascending: query.ascending,
      status: status ? (status as BookingStatus) : undefined,
      scheduledDateRange: dateRange[0] || dateRange[1]
        ? [
          dateRange[0] ? datetime.formatDateISO(dateRange[0]) : null,
          dateRange[1] ? datetime.formatDateISO(dateRange[1]) : null,
        ]
        : undefined,
    },
    {
      query: {
        enabled: !!clientId,
      },
    },
  );

  const { data: ratingsData } = useFindRatings(
    { pageSize: 100 },
    { query: { enabled: !!clientId } },
  );

  const bookingIds = new Set(bookingsData?.items?.map((b) => b.id) ?? []);
  const ratedBookingIds = new Set(
    ratingsData?.items?.filter((r) => bookingIds.has(r.bookingId)).map((r) => r.bookingId) ?? [],
  );

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('client.bookings.notifications.cancelSuccessTitle'),
          message: t('client.bookings.notifications.cancelSuccessMessage'),
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setCancellingBookingId(null);
      },
      onError: () => {
        setCancellingBookingId(null);
      },
    },
  });

  const { mutate: forceComplete, isPending: isForceCompleting } = useForceCompleteBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
      },
    },
  });

  const handleCancel = (bookingId: string) => {
    setCancellingBookingId(bookingId);
    cancelBooking({ id: bookingId, data: { bookingId, clientId } });
  };

  const handleDateRangeChange = (value: DatesRangeValue) => {
    setDateRange(value);
    onPageChange(1);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? '');
    onPageChange(1);
  };

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'masterJobTitle',
      title: t('client.recentBookings.table.columns.service'),
      render: (booking) => (
        <Stack gap={2}>
          <Text size="sm" fw={500}>{translateService(booking.masterJobTitle)}</Text>
          <Text size="xs" c="dimmed">{booking.masterName}</Text>
        </Stack>
      ),
    },
    {
      accessor: 'scheduledAt',
      title: t('client.recentBookings.table.columns.date'),
      sortKey: 'scheduledAt',
      render: renderScheduledAt,
    },
    {
      accessor: 'duration',
      title: t('client.recentBookings.table.columns.duration'),
      render: renderDuration,
    },
    {
      accessor: 'price',
      title: t('client.recentBookings.table.columns.price'),
      sortKey: 'price',
      render: renderPrice,
    },
    {
      accessor: 'status',
      title: t('client.recentBookings.table.columns.status'),
      sortKey: 'status',
      render: BookingStatusBadge,
    },
    {
      accessor: 'actions',
      title: t('client.bookings.table.columns.actions'),
      render: (booking) => (
        <BookingActionsRenderer
          booking={booking}
          onCancel={handleCancel}
          isCancelling={isCancelling && cancellingBookingId === booking.id}
          isRated={ratedBookingIds.has(booking.id)}
          onForceComplete={(id) => forceComplete({ id: id as string })}
          isForceCompleting={isForceCompleting}
        />
      ),
    },
  ];

  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        <div>
          <Title order={4}>{t('client.recentBookings.title')}</Title>
          <Text c="dimmed" size="sm">{t('client.recentBookings.subtitle')}</Text>
        </div>

        <ClientBookingsDataTableFilters
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          status={status}
          onStatusChange={handleStatusChange}
        />

        <PagedDataTable<FindBookingsResponsePagedResponse, FindBookingsResponse>
          idAccessor="id"
          data={bookingsData}
          columns={columns}
          fetching={isLoading}
          onPageChange={onPageChange}
          onRecordsPerPageChange={onRecordsPerPageChange}
          sortStatus={sortStatus}
          onSortStatusChange={(newStatus) => handleSortStatusChange(newStatus, columns)}
          noRecordsText={t('client.bookings.empty')}
        />
      </Stack>
    </Card>
  );
}
