import { useMemo, useState } from 'react';
import {
  Card, Stack,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@/components/paged-data-table';
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

import { BookingsFilters } from './master-bookings-data-table-filters';
import {
  ActionsRenderer,
  renderClient,
  renderDateTime,
  renderJobDetails,
  renderPricing,
  renderStatus,
} from './master-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

type BookingsQuery = FindBookingsParams;

export function MasterBookingsDataTable() {
  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [status, setStatus] = useState<string>('all');
  const [searchValue, setSearchValue] = useState('');
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);

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
  });

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
      status: status && status !== 'all' ? (status as BookingStatus) : undefined,
      from: datetime.toDate(dateRange[0]),
      to: datetime.toDate(dateRange[1]),
      search: searchValue || undefined,
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
    setDateRange(value);
    onPageChange(1);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? 'all');
    onPageChange(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onPageChange(1);
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
      render: renderJobDetails,
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

  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="lg">
        <BookingsFilters
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          status={status}
          onStatusChange={handleStatusChange}
          searchValue={searchValue}
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
  );
}
