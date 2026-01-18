import { useMemo } from 'react';
import { Box, Container, Stack } from '@mantine/core';

import { BookingStatus } from '@/state/endpoints/api.schemas';
import { useFindBookings } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

import { ClientBookingsDataTable } from './client-bookings-data-table/client-bookings-data-table';
import ClientDashboardHeader from './client-dashboard-header';
import ClientDashboardStats from './client-dashboard-stats';

function ClientDashboardPage() {
  const { data: user } = useGetUser();
  const clientId = user?.id ?? '';

  const { data: allBookingsData } = useFindBookings(
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
    () => allBookingsData?.items.filter((b) => b.status === BookingStatus.Requested || b.status === BookingStatus.Confirmed).length,
    [allBookingsData?.items],
  );

  const completedCount = useMemo(
    () => allBookingsData?.items.filter((b) => b.status === BookingStatus.Completed).length,
    [allBookingsData?.items],
  );

  const totalSpent = useMemo(
    () => allBookingsData?.items
      .filter((b) => b.status === BookingStatus.Completed)
      .reduce((sum, b) => sum + b.price, 0),
    [allBookingsData?.items],
  );

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <ClientDashboardHeader />
          <ClientDashboardStats
            upcomingCount={upcomingCount ?? 0}
            completedCount={completedCount ?? 0}
            totalSpent={totalSpent ?? 0}
          />
          <ClientBookingsDataTable />
        </Stack>
      </Container>
    </Box>
  );
}

export default ClientDashboardPage;
