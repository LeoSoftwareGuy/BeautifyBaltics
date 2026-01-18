import { useState } from 'react';
import {
  Card, Stack, Text, Title,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

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
  renderDuration,
  renderPrice,
  renderScheduledAt,
  renderStatus,
} from './master-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

type BookingsQuery = FindBookingsParams;

export function MasterBookingsDataTable() {
  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';
  const queryClient = useQueryClient();

  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [status, setStatus] = useState<string>('');
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
      status: status ? (status as BookingStatus) : undefined,
      from: datetime.toDate(dateRange[0]),
      to: datetime.toDate(dateRange[1]),
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
          title: 'Booking confirmed',
          message: 'The booking has been confirmed successfully.',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setActionBookingId(null);
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Failed to confirm booking',
          message: error.message || 'An error occurred while confirming the booking.',
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
          title: 'Booking cancelled',
          message: 'The booking has been cancelled successfully.',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setActionBookingId(null);
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Failed to cancel booking',
          message: error.message || 'An error occurred while cancelling the booking.',
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
    setStatus(value ?? '');
    onPageChange(1);
  };

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'clientName',
      title: 'Client',
      sortKey: 'clientName',
    },
    {
      accessor: 'masterJobTitle',
      title: 'Service',
      sortKey: 'masterJobTitle',
    },
    {
      accessor: 'scheduledAt',
      title: 'Date & Time',
      sortKey: 'scheduledAt',
      render: renderScheduledAt,
    },
    {
      accessor: 'duration',
      title: 'Duration',
      render: renderDuration,
    },
    {
      accessor: 'price',
      title: 'Price',
      sortKey: 'price',
      render: renderPrice,
    },
    {
      accessor: 'status',
      title: 'Status',
      sortKey: 'status',
      render: renderStatus,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (booking) => (
        <ActionsRenderer
          booking={booking}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isConfirming={isConfirming && actionBookingId === booking.id}
          isCancelling={isCancelling && actionBookingId === booking.id}
        />
      ),
    },
  ];

  return (
    <Card withBorder>
      <Stack gap="md">
        <div>
          <Title order={3}>My Bookings</Title>
          <Text c="dimmed" fz="sm">Manage your appointments and client bookings</Text>
        </div>

        <BookingsFilters
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
          noRecordsText="No bookings found"
        />
      </Stack>
    </Card>
  );
}
