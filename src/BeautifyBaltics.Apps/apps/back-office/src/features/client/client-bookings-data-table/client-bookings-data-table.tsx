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
  useFindBookings,
} from '@/state/endpoints/bookings';
import { useFindRatings } from '@/state/endpoints/ratings';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import { ClientBookingRatingModal } from './client-booking-rating-modal';
import { ClientBookingsDataTableFilters } from './client-bookings-data-table-filters';
import {
  BookingActionsRenderer,
  renderDuration,
  renderLocation,
  renderPrice,
  renderScheduledAt,
  renderStatus,
} from './client-bookings-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

type BookingsQuery = FindBookingsParams;

export function ClientBookingsDataTable() {
  const { data: user } = useGetUser();
  const clientId = user?.id ?? '';
  const queryClient = useQueryClient();

  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [status, setStatus] = useState<string>('');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [bookingToRate, setBookingToRate] = useState<FindBookingsResponse | null>(null);

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
      clientId,
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
        enabled: !!clientId,
      },
    },
  );

  const { data: ratingsData } = useFindRatings(
    { pageSize: 100 },
    { query: { enabled: !!clientId } },
  );

  // Filter ratings for this client's bookings
  const clientBookingIds = new Set(bookingsData?.items?.map((b) => b.id) ?? []);
  const ratedBookingIds = new Set(
    ratingsData?.items?.filter((r) => clientBookingIds.has(r.bookingId)).map((r) => r.bookingId) ?? [],
  );

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Booking cancelled',
          message: 'Your booking has been cancelled successfully.',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setCancellingBookingId(null);
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Failed to cancel booking',
          message: error.message || 'An error occurred while confirming the booking.',
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
    setDateRange(value);
    onPageChange(1);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? '');
    onPageChange(1);
  };

  const handleRate = (booking: FindBookingsResponse) => {
    setBookingToRate(booking);
    setRatingModalOpen(true);
  };

  const handleRatingModalClose = () => {
    setRatingModalOpen(false);
    setBookingToRate(null);
  };

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'masterName',
      title: 'Master',
      sortKey: 'masterName',
    },
    {
      accessor: 'masterJobTitle',
      title: 'Service',
      sortKey: 'masterJobTitle',
    },
    {
      accessor: 'locationCity',
      title: 'Location',
      render: renderLocation,
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
        <BookingActionsRenderer
          booking={booking}
          onCancel={handleCancel}
          onRate={handleRate}
          isCancelling={isCancelling && cancellingBookingId === booking.id}
          isRated={ratedBookingIds.has(booking.id)}
        />
      ),
    },
  ];

  return (
    <Card withBorder>
      <Stack gap="md">
        <div>
          <Title order={3}>My Bookings</Title>
          <Text c="dimmed" fz="sm">View and manage your appointments</Text>
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
          noRecordsText="No bookings found"
        />
      </Stack>

      <ClientBookingRatingModal
        opened={ratingModalOpen}
        booking={bookingToRate}
        onClose={handleRatingModalClose}
      />
    </Card>
  );
}
