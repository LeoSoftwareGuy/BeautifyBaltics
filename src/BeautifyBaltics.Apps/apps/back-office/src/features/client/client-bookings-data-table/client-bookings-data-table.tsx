import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  Box, Button, Card, ScrollArea, Stack, Text, TextInput, Title,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

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
} from '@/state/endpoints/bookings';
import { useForceCompleteBooking } from '@/state/endpoints/bookings-dev';
import { useFindRatings } from '@/state/endpoints/ratings';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import { ClientBookingsDataTableFilters } from './client-bookings-data-table-filters';
import {
  BookingActionsRenderer,
  BookingLocationCell,
  BookingMobileCard,
  BookingStatusBadge,
  renderDuration,
  renderPrice,
  renderScheduledAt,
} from './client-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

type BookingsQuery = FindBookingsParams;

export function ClientBookingsDataTable() {
  const { data: user } = useGetUser();
  const clientId = user?.id ?? '';
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { translateService } = useTranslateData();

  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [mobileSearch, setMobileSearch] = useState('');
  const isMobile = useMediaQuery('(max-width: 62em)');

  const {
    query,
    sortStatus,
    onPageChange,
    onRecordsPerPageChange,
    onFilterChange,
    handleSortStatusChange,
  } = usePagedTableQuery<BookingsQuery, FindBookingsResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'scheduledAt',
    ascending: false,
    status: undefined as BookingStatus | undefined,
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
  });

  const dateRange: DatesRangeValue = [query.from ?? null, query.to ?? null];

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
      status: query.status ? (query.status as BookingStatus) : undefined,
      from: query.from,
      to: query.to,
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

  const clientBookingIds = new Set(bookingsData?.items?.map((b) => b.id) ?? []);
  const ratedBookingIds = new Set(
    ratingsData?.items?.filter((r) => clientBookingIds.has(r.bookingId)).map((r) => r.bookingId) ?? [],
  );

  const { mutate: forceComplete, isPending: isForceCompleting } = useForceCompleteBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
      },
    },
  });

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
      onError: (error: any) => {
        notifications.show({
          title: t('client.bookings.notifications.cancelErrorTitle'),
          message: error.message || t('client.bookings.notifications.cancelErrorMessage'),
          color: 'red',
        });
        setCancellingBookingId(null);
      },
    },
  });

  const handleCancel = (bookingId: string) => {
    setCancellingBookingId(bookingId);
    cancelBooking({
      id: bookingId,
      data: { bookingId, clientId },
    });
  };

  const handleDateRangeChange = (value: DatesRangeValue) => {
    onFilterChange('from', datetime.toDate(value[0]));
    onFilterChange('to', datetime.toDate(value[1]));
  };

  const handleStatusChange = (value: string | null) => {
    onFilterChange('status', value || undefined);
  };

  const STATUS_CHIPS = [
    { value: '', label: t('client.bookings.filters.allStatuses') },
    { value: BookingStatus.Requested, label: t('client.bookings.status.requested') },
    { value: BookingStatus.Confirmed, label: t('client.bookings.status.confirmed') },
    { value: BookingStatus.Completed, label: t('client.bookings.status.completed') },
    { value: BookingStatus.Cancelled, label: t('client.bookings.status.cancelled') },
  ];

  const mobileBookings = useMemo(() => {
    const items = bookingsData?.items ?? [];
    if (!mobileSearch.trim()) return items;
    const q = mobileSearch.toLowerCase();
    return items.filter((b) => b.masterName.toLowerCase().includes(q) || b.masterJobTitle.toLowerCase().includes(q));
  }, [bookingsData?.items, mobileSearch]);

  const activeChip = query.status ?? '';

  const chipStyle = (active: boolean): React.CSSProperties => ({
    whiteSpace: 'nowrap',
    padding: '8px 20px',
    borderRadius: 9999,
    border: active ? 'none' : '1px solid #e2e8f0',
    background: active ? '#d8557a' : '#fff',
    color: active ? '#fff' : '#64748b',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
  });

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'masterName',
      title: t('client.bookings.table.columns.master'),
      sortKey: 'masterName',
    },
    {
      accessor: 'masterJobTitle',
      title: t('client.bookings.table.columns.service'),
      sortKey: 'masterJobTitle',
      render: (booking) => translateService(booking.masterJobTitle),
    },
    {
      accessor: 'locationCity',
      title: t('client.bookings.table.columns.location'),
      render: BookingLocationCell,
    },
    {
      accessor: 'scheduledAt',
      title: t('client.bookings.table.columns.scheduledAt'),
      sortKey: 'scheduledAt',
      render: renderScheduledAt,
    },
    {
      accessor: 'duration',
      title: t('client.bookings.table.columns.duration'),
      render: renderDuration,
    },
    {
      accessor: 'price',
      title: t('client.bookings.table.columns.price'),
      sortKey: 'price',
      render: renderPrice,
    },
    {
      accessor: 'status',
      title: t('client.bookings.table.columns.status'),
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
          onForceComplete={(id) => forceComplete(id)}
          isForceCompleting={isForceCompleting}
        />
      ),
    },
  ];

  if (isMobile) {
    return (
      <Box>
        {/* Search */}
        <TextInput
          placeholder={t('client.bookings.filters.searchPlaceholder')}
          leftSection={<IconSearch size={16} color="#94a3b8" />}
          value={mobileSearch}
          onChange={(e) => setMobileSearch(e.currentTarget.value)}
          mb="sm"
          radius="xl"
          styles={{ input: { border: 'none', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } }}
        />

        {/* Status chips */}
        <ScrollArea type="never" mb="md">
          <Box style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
            {STATUS_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                style={chipStyle(activeChip === chip.value)}
                onClick={() => handleStatusChange(chip.value || null)}
              >
                {chip.label}
              </button>
            ))}
          </Box>
        </ScrollArea>

        {/* Cards */}
        <Stack gap="md">
          {isLoading && (
            <Text c="dimmed" ta="center" py="xl">{t('common.loading') || 'Loading...'}</Text>
          )}
          {!isLoading && mobileBookings.length === 0 && (
            <Stack align="center" py="xl" gap="md">
              <Text c="dimmed" ta="center">{t('client.bookings.empty')}</Text>
              <Button
                radius="xl"
                style={{ background: '#d8557a' }}
                onClick={() => navigate({ to: '/explore' })}
              >
                {t('client.bookings.bookCta')}
              </Button>
            </Stack>
          )}
          {!isLoading && mobileBookings.map((booking) => (
            <BookingMobileCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              isCancelling={isCancelling && cancellingBookingId === booking.id}
              isRated={ratedBookingIds.has(booking.id)}
            />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Card withBorder>
      <Stack gap="md">
        <div>
          <Title order={3}>{t('client.bookings.headerTitle')}</Title>
          <Text c="dimmed" fz="sm">{t('client.bookings.headerSubtitle')}</Text>
        </div>

        <ClientBookingsDataTableFilters
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          status={query.status ?? ''}
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
