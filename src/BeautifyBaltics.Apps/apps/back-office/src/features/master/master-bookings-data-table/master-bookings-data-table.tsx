import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  IconCalendarEvent,
  IconClock,
  IconCurrencyEuro,
  IconSearch,
} from '@tabler/icons-react';
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
  useConfirmBooking,
  useFindBookings,
} from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import { BookingsFilters, STATUS_TABS } from './master-bookings-data-table-filters';
import {
  ActionsRenderer,
  getStatusColor,
  JobDetailsCell,
  renderClient,
  renderDateTime,
  renderPricing,
  renderStatus,
} from './master-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

type MobileBookingCardProps = {
  booking: FindBookingsResponse;
  statusLabel: string;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  isConfirming: boolean;
  isCancelling: boolean;
  labels: { confirm: string; cancel: string };
};

function MobileBookingCard({
  booking,
  statusLabel,
  onConfirm,
  onCancel,
  isConfirming,
  isCancelling,
  labels,
}: MobileBookingCardProps) {
  const { translateService } = useTranslateData();
  const date = datetime.formatDate(booking.scheduledAt);
  const time = datetime.formatTimeFromDate(booking.scheduledAt);
  const isPending = booking.status === BookingStatus.Requested;
  const hoursUntil = (new Date(booking.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60);
  const isCancellable = booking.status !== BookingStatus.Cancelled
    && booking.status !== BookingStatus.Completed
    && hoursUntil >= 24;

  return (
    <Paper
      p="md"
      radius="lg"
      style={{ border: '1px solid var(--mantine-color-pink-1)', backgroundColor: 'white' }}
    >
      <Group justify="space-between" mb="md" align="flex-start">
        <Group gap="sm">
          <Avatar name={booking.clientName} color="initials" size={48} radius="xl" />
          <div>
            <Text fw={700} size="sm">{booking.clientName}</Text>
            <Text size="xs" c="dimmed">{translateService(booking.masterJobTitle)}</Text>
          </div>
        </Group>
        <Badge
          color={getStatusColor(booking.status)}
          variant="light"
          radius="xl"
          tt="uppercase"
          size="xs"
          fw={700}
        >
          {statusLabel}
        </Badge>
      </Group>

      <SimpleGrid
        cols={2}
        py="sm"
        style={{
          borderTop: '1px solid var(--mantine-color-gray-1)',
          borderBottom: '1px solid var(--mantine-color-gray-1)',
        }}
      >
        <Group gap="xs">
          <IconCalendarEvent size={14} color="var(--mantine-color-pink-5)" />
          <Text size="sm">{date}</Text>
        </Group>
        <Group gap="xs">
          <IconClock size={14} color="var(--mantine-color-pink-5)" />
          <Text size="sm">{time}</Text>
        </Group>
        <Group gap="xs">
          <IconCurrencyEuro size={14} color="var(--mantine-color-pink-5)" />
          <Text size="sm" fw={700}>
            €
            {booking.price.toFixed(2)}
          </Text>
        </Group>
      </SimpleGrid>

      {isPending && (
        <Group grow mt="md">
          <Button
            color="brand"
            onClick={() => onConfirm(booking.id)}
            loading={isConfirming}
            disabled={isCancelling}
          >
            {labels.confirm}
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={() => onCancel(booking.id)}
            loading={isCancelling}
            disabled={isConfirming}
          >
            {labels.cancel}
          </Button>
        </Group>
      )}
      {!isPending && isCancellable && (
        <Button
          fullWidth
          variant="light"
          color="red"
          mt="md"
          onClick={() => onCancel(booking.id)}
          loading={isCancelling}
        >
          {labels.cancel}
        </Button>
      )}
    </Paper>
  );
}

type BookingsQuery = Omit<FindBookingsParams, 'status'> & { status?: BookingStatus | 'all' };

export function MasterBookingsDataTable() {
  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [actionBookingId, setActionBookingId] = useState<string | null>(null);

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
    status: 'all' as BookingStatus | 'all',
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
    search: undefined as string | undefined,
  });

  const dateRange: DatesRangeValue = [query.from ?? null, query.to ?? null];

  const {
    data: bookingsData,
    isLoading,
  } = useFindBookings(
    {
      masterId,
      page: query.page,
      pageSize: query.pageSize,
      sortBy: query.sortBy,
      ascending: query.ascending,
      status: query.status && query.status !== 'all' ? (query.status as BookingStatus) : undefined,
      from: query.from,
      to: query.to,
      search: query.search || undefined,
    },
    {
      query: {
        enabled: !!masterId,
      },
    },
  );

  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('master.bookings.notifications.confirmSuccessTitle'),
          message: t('master.bookings.notifications.confirmSuccessMessage'),
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setActionBookingId(null);
      },
      onError: (error: any) => {
        notifications.show({
          title: t('master.bookings.notifications.confirmErrorTitle'),
          message: error.message || t('master.bookings.notifications.confirmErrorMessage'),
          color: 'red',
        });
        setActionBookingId(null);
      },
    },
  });

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('master.bookings.notifications.cancelSuccessTitle'),
          message: t('master.bookings.notifications.cancelSuccessMessage'),
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setActionBookingId(null);
      },
      onError: (error: any) => {
        notifications.show({
          title: t('master.bookings.notifications.cancelErrorTitle'),
          message: error.message || t('master.bookings.notifications.cancelErrorMessage'),
          color: 'red',
        });
        setActionBookingId(null);
      },
    },
  });

  const handleConfirm = (bookingId: string) => {
    setActionBookingId(bookingId);
    confirmBooking({
      id: bookingId,
      data: { bookingId, masterId },
    });
  };

  const handleCancel = (bookingId: string) => {
    setActionBookingId(bookingId);
    cancelBooking({
      id: bookingId,
      data: { bookingId, masterId },
    });
  };

  const handleDateRangeChange = (value: DatesRangeValue) => {
    onFilterChange('from', datetime.toDate(value[0]));
    onFilterChange('to', datetime.toDate(value[1]));
  };

  const handleStatusChange = (value: string | null) => {
    onFilterChange('status', value ?? 'all');
  };

  const handleSearchChange = (value: string) => {
    onFilterChange('search', value || undefined);
  };

  const statusLabels = useMemo(
    () => ({
      [BookingStatus.Requested]: t('master.bookings.status.requested'),
      [BookingStatus.Confirmed]: t('master.bookings.status.confirmed'),
      [BookingStatus.Completed]: t('master.bookings.status.completed'),
      [BookingStatus.Cancelled]: t('master.bookings.status.cancelled'),
    }),
    [t],
  );

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'clientName',
      title: t('master.bookings.table.columns.client'),
      render: (booking) => renderClient(booking, t('master.bookings.table.clientRoleLabel')),
    },
    {
      accessor: 'masterJobTitle',
      title: t('master.bookings.table.columns.jobDetails'),
      render: JobDetailsCell,
    },
    {
      accessor: 'scheduledAt',
      title: t('master.bookings.table.columns.date'),
      sortKey: 'scheduledAt',
      render: renderDateTime,
    },
    {
      accessor: 'price',
      title: t('master.bookings.table.columns.price'),
      sortKey: 'price',
      render: renderPricing,
    },
    {
      accessor: 'status',
      title: t('master.bookings.table.columns.status'),
      sortKey: 'status',
      render: (booking) => renderStatus(booking, statusLabels),
    },
    {
      accessor: 'actions',
      title: t('master.bookings.table.columns.actions'),
      render: (booking) => (
        <ActionsRenderer
          booking={booking}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isConfirming={isConfirming && actionBookingId === booking.id}
          isCancelling={isCancelling && actionBookingId === booking.id}
          labels={{
            viewInvoice: t('master.bookings.table.viewInvoice'),
            confirm: t('master.bookings.table.confirm'),
            cancel: t('master.bookings.table.cancel'),
          }}
        />
      ),
    },
  ];

  const bookings = bookingsData?.items ?? [];

  return (
    <>
      {/* ── MOBILE LAYOUT ── */}
      <Box hiddenFrom="md">
        {/* Sticky search + tabs header */}
        <Box
          pos="sticky"
          top={0}
          bg="var(--mantine-color-body)"
          style={{ zIndex: 100, borderBottom: '1px solid var(--mantine-color-default-border)' }}
        >
          <Box px="md" pt="md" pb="sm">
            <TextInput
              placeholder={t('master.bookings.filters.searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              value={query.search ?? ''}
              onChange={(e) => handleSearchChange(e.currentTarget.value)}
              radius="xl"
            />
          </Box>
          <ScrollArea type="never">
            <Tabs value={query.status ?? 'all'} onChange={handleStatusChange}>
              <Tabs.List px="md" style={{ flexWrap: 'nowrap', borderBottom: 'none' }} pb="xs">
                {STATUS_TABS.map((tab) => (
                  <Tabs.Tab key={tab.value} value={tab.value} style={{ whiteSpace: 'nowrap' }}>
                    {t(tab.labelKey)}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </ScrollArea>
        </Box>

        {/* Booking cards */}
        <Stack gap="sm" px="md" py="lg">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={i} height={180} radius="lg" />
          ))}
          {!isLoading && bookings.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              {t('master.bookings.table.noRecords')}
            </Text>
          )}
          {!isLoading && bookings.length > 0 && bookings.map((booking) => (
            <MobileBookingCard
              key={booking.id}
              booking={booking}
              statusLabel={statusLabels[booking.status] ?? booking.status}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              isConfirming={isConfirming && actionBookingId === booking.id}
              isCancelling={isCancelling && actionBookingId === booking.id}
              labels={{
                confirm: t('master.bookings.table.confirm'),
                cancel: t('master.bookings.table.cancel'),
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* ── DESKTOP LAYOUT ── */}
      <Card withBorder radius="md" p="lg" visibleFrom="md">
        <Stack gap="lg">
          <BookingsFilters
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            status={query.status ?? 'all'}
            onStatusChange={handleStatusChange}
            searchValue={query.search ?? ''}
            onSearchChange={handleSearchChange}
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
            noRecordsText={t('master.bookings.table.noRecords')}
          />
        </Stack>
      </Card>
    </>
  );
}
