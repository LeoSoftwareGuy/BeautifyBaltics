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
import { IconCalendarEvent, IconMapPin } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { FindBookingsResponse } from '@/state/endpoints/api.schemas';

interface ClientDashboardNextSessionProps {
  booking?: FindBookingsResponse;
  isLoading?: boolean;
}

export function ClientDashboardNextSession({ booking, isLoading }: ClientDashboardNextSessionProps) {
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

  return (
    <Card withBorder radius="md" p="lg">
      <Group gap="xs" mb="md">
        <IconCalendarEvent size={20} />
        <Title order={4}>Your Next Session</Title>
      </Group>

      <Card radius="md" p={0} style={{ overflow: 'hidden' }}>
        <Box pos="relative">
          <Image
            src={booking.masterJobCategoryImageUrl}
            height={160}
            alt={booking.masterJobTitle}
            fallbackSrc="https://placehold.co/600x400/e9ecef/868e96?text=Session"
          />
          <Group pos="absolute" top={12} left={12} gap="xs">
            <Badge color="blue" variant="filled" size="sm">
              UPCOMING
            </Badge>
            <Badge color="dark" variant="filled" size="sm">
              {timeUntil}
            </Badge>
          </Group>
        </Box>

        <Stack gap="sm" p="md" bg="var(--mantine-color-gray-0)">
          <div>
            <Text fw={600} size="lg">{booking.masterJobTitle}</Text>
            <Text size="sm" c="dimmed">
              with
              {' '}
              {booking.masterName}
            </Text>
          </div>

          <Group gap="xs">
            <IconMapPin size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">{location}</Text>
          </Group>

          <Text size="sm" c="dimmed">
            {scheduledDate.format('dddd, MMMM D, YYYY')}
            {' at '}
            {scheduledDate.format('h:mm A')}
          </Text>

          <Group gap="sm" mt="xs">
            <Button variant="filled" color="brand" size="sm" style={{ flex: 1 }}>
              View Details
            </Button>
            <Button variant="light" color="gray" size="sm" style={{ flex: 1 }}>
              Get Directions
            </Button>
          </Group>
        </Stack>
      </Card>
    </Card>
  );
}
