import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { useTranslateData } from '@/hooks/use-translate-data';
import { BookingStatus, FindBookingsResponse } from '@/state/endpoints/api.schemas';

interface MasterDashboardTodaysScheduleProps {
  bookings?: FindBookingsResponse[];
  isLoading?: boolean;
}

function getStatusColor(status: BookingStatus) {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'brand';
    case BookingStatus.Requested:
      return 'yellow';
    case BookingStatus.Completed:
      return 'green';
    case BookingStatus.Cancelled:
      return 'red';
    default:
      return 'gray';
  }
}

function formatDuration(duration: string): string {
  // Duration comes as "HH:MM:SS" format
  const parts = duration.split(':');
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours} Hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      return `${minutes} Min`;
    }
  }
  return duration;
}

export function MasterDashboardTodaysSchedule({ bookings = [], isLoading }: MasterDashboardTodaysScheduleProps) {
  const { translateService } = useTranslateData();
  if (isLoading) {
    return (
      <Card withBorder radius="md" p="lg" h="100%">
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Today&apos;s Schedule</Text>
          <Anchor component={Link} to="/master/time-slots" size="sm" c="brand">
            View Calendar
          </Anchor>
        </Group>
        <Stack gap="md">
          {[1, 2].map((i) => (
            <Group key={i} gap="md">
              <Skeleton width={60} height={16} />
              <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Group gap="xs">
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={100} height={16} />
                  </Group>
                  <Skeleton width={70} height={20} />
                </Group>
                <Skeleton width={150} height={14} />
                <Group gap="md">
                  <Skeleton width={80} height={12} />
                  <Skeleton width={60} height={12} />
                </Group>
              </Stack>
            </Group>
          ))}
        </Stack>
      </Card>
    );
  }

  const sortedBookings = [...bookings]
    .filter((b) => b.status !== BookingStatus.Cancelled)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Today&apos;s Schedule</Text>
        <Anchor component={Link} to="/master/time-slots" size="sm" c="brand">
          View Calendar
        </Anchor>
      </Group>

      {sortedBookings.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">No bookings scheduled for today</Text>
      ) : (
        <Timeline active={-1} bulletSize={12} lineWidth={2}>
          {sortedBookings.map((booking) => (
            <Timeline.Item
              key={booking.id}
              bullet={<Box w={8} h={8} bg="brand" style={{ borderRadius: '50%' }} />}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Text size="sm" c="dimmed" w={60}>
                  {dayjs(booking.scheduledAt).format('hh:mm A')}
                </Text>
                <Stack gap={4} style={{ flex: 1 }}>
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                      <Avatar name={booking.clientName} size="sm" radius="xl" color="initials" />
                      <Text fw={500} size="sm">{booking.clientName}</Text>
                    </Group>
                    <Badge
                      variant="light"
                      color={getStatusColor(booking.status)}
                      size="sm"
                      tt="uppercase"
                    >
                      {booking.status}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">{translateService(booking.masterJobTitle)}</Text>
                  <Group gap="md">
                    {booking.locationCity && (
                      <Group gap={4}>
                        <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                        <Text size="xs" c="dimmed">{booking.locationCity}</Text>
                      </Group>
                    )}
                    <Group gap={4}>
                      <IconClock size={14} color="var(--mantine-color-dimmed)" />
                      <Text size="xs" c="dimmed">{formatDuration(booking.duration)}</Text>
                    </Group>
                  </Group>
                </Stack>
              </Group>
              <Divider my="sm" />
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Card>
  );
}
