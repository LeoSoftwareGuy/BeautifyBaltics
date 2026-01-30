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
    setStatus(value ?? 'all');
    onPageChange(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onPageChange(1);
  };

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'clientName',
      title: 'CLIENT',
      render: renderClient,
    },
    {
      accessor: 'masterJobTitle',
      title: 'JOB DETAILS',
      render: renderJobDetails,
    },
    {
      accessor: 'scheduledAt',
      title: 'DATE & TIME',
      sortKey: 'scheduledAt',
      render: renderDateTime,
    },
    {
      accessor: 'price',
      title: 'PRICING',
      sortKey: 'price',
      render: renderPricing,
    },
    {
      accessor: 'status',
      title: 'STATUS',
      sortKey: 'status',
      render: renderStatus,
    },
    {
      accessor: 'actions',
      title: 'ACTIONS',
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
    <Card withBorder radius="md" p="lg">
      <Stack gap="lg">
        <Stack gap="sm">
          <Title order={2} fw={600}>Bookings Management</Title>
          <Text c="dimmed" size="sm">
            Organize your schedule and client requests effectively.
          </Text>
        </Stack>

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
          noRecordsText="No bookings found"
        />
      </Stack>
    </Card>
  );
}
