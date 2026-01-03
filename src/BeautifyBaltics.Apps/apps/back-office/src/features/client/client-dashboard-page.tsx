import { useMemo, useState } from 'react';
import { Box, Container, Stack } from '@mantine/core';

import ClientBookingCard from './components/client-booking-card';
import ClientDashboardHeader from './components/client-dashboard-header';
import ClientDashboardStats from './components/client-dashboard-stats';
import ClientFiltersBar from './components/client-filters-bar';
import { type BookingStatus, MOCK_BOOKINGS } from './data';

function ClientDashboardPage() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  const filteredBookings = useMemo(() => MOCK_BOOKINGS
    .filter((booking) => filter === 'all' || booking.status === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.price - a.price;
    }), [filter, sortBy]);

  const upcomingCount = useMemo(() => MOCK_BOOKINGS.filter((b) => b.status === 'upcoming').length, []);
  const completedCount = useMemo(() => MOCK_BOOKINGS.filter((b) => b.status === 'completed').length, []);
  const totalSpent = useMemo(
    () => MOCK_BOOKINGS
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + b.price, 0),
    [],
  );

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <ClientDashboardHeader />
          <ClientDashboardStats
            upcomingCount={upcomingCount}
            completedCount={completedCount}
            totalSpent={totalSpent}
          />
          <ClientFiltersBar
            filter={filter}
            sortBy={sortBy}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
          />
          <Stack gap="md">
            {filteredBookings.map((booking) => (
              <ClientBookingCard key={booking.id} booking={booking} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default ClientDashboardPage;
