import { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCalendarEvent, IconMapPin } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { FindBookingsResponse } from '@/state/endpoints/api.schemas';
import { getFindBookingsQueryKey, useCancelBooking } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

import { ClientBookingDetailsDrawer } from './client-booking-details-drawer';

interface ClientDashboardNextSessionProps {
  booking?: FindBookingsResponse;
  isLoading?: boolean;
}

export function ClientDashboardNextSession({ booking, isLoading }: ClientDashboardNextSessionProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Booking cancelled',
          message: 'Your booking has been cancelled successfully.',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setDrawerOpened(false);
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Failed to cancel booking',
          message: error.message || 'An error occurred while cancelling the booking.',
          color: 'red',
        });
      },
    },
  });

  const handleCancel = (bookingId: string) => {
    cancelBooking({
      id: bookingId,
      data: { bookingId, clientId: user?.id ?? '' },
    });
  };

  if (isLoading) {
    return (
      <Card withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconCalendarEvent size={20} />
          <Title order={4}>Your Next Session</Title>
        </Group>
        <Skeleton height={200} radius="md" />
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconCalendarEvent size={20} />
          <Title order={4}>Your Next Session</Title>
        </Group>
        <Box
          bg="var(--mantine-color-gray-1)"
          p="xl"
          style={{ borderRadius: 'var(--mantine-radius-md)' }}
        >
          <Text c="dimmed" ta="center">No upcoming sessions</Text>
          <Text size="sm" c="dimmed" ta="center" mt="xs">
            Book a session with one of our masters to get started
          </Text>
        </Box>
      </Card>
    );
  }

  const scheduledDate = dayjs(booking.scheduledAt);
  const now = dayjs();
  const diffMinutes = scheduledDate.diff(now, 'minute');
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  let timeUntil = '';
  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    timeUntil = `Starts in ${days} day${days > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    timeUntil = `Starts in ${diffHours}h ${remainingMinutes}m`;
  } else if (diffMinutes > 0) {
    timeUntil = `Starts in ${diffMinutes}m`;
  } else {
    timeUntil = 'Starting soon';
  }

  const location = [booking.locationCity, booking.locationCountry]
    .filter(Boolean)
    .join(', ') || 'Location not specified';

  const fullLocation = [
    booking.locationAddressLine1,
    booking.locationAddressLine2,
    booking.locationCity,
  ].filter(Boolean).join(', ') || location;

  return (
    <Card withBorder radius="md" p="lg">
      <Group gap="xs" mb="md">
        <IconCalendarEvent size={20} />
        <Title order={4}>Your Next Session</Title>
      </Group>

      <Card radius="md" p={0} style={{ overflow: 'hidden' }}>
        <Group gap={0} align="stretch" wrap="nowrap">
          <Image
            src={null}
            w={220}
            h={160}
            alt={booking.masterJobTitle}
            fallbackSrc="https://placehold.co/180x160/e9ecef/868e96?text=Session"
            style={{ objectFit: 'cover', flexShrink: 0 }}
          />

          <Stack gap="sm" p="md" style={{ flex: 1 }}>
            <Group gap="xs">
              <Badge color="blue" variant="filled" size="sm">
                UPCOMING TODAY
              </Badge>
              <Badge color="dark" variant="filled" size="sm">
                {timeUntil}
              </Badge>
            </Group>

            <div>
              <Text fw={600} size="md">
                {booking.masterJobTitle}
                {' '}
                with
                {' '}
                {booking.masterName}
              </Text>
            </div>

            <Group gap="xs">
              <IconMapPin size={16} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">{fullLocation}</Text>
            </Group>

            <Group gap="sm" mt="auto">
              <Button
                variant="filled"
                color="brand"
                size="sm"
                onClick={() => setDrawerOpened(true)}
              >
                View Details
              </Button>
            </Group>
          </Stack>
        </Group>
      </Card>

      <ClientBookingDetailsDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        booking={booking}
        onCancel={handleCancel}
        isCancelling={isCancelling}
      />
    </Card>
  );
}
