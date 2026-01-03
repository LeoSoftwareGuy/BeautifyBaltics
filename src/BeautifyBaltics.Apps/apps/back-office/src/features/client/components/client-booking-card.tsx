import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  Calendar,
  Clock,
  MapPin,
  User,
} from 'lucide-react';

import type { Booking } from '../data';

type BookingCardProps = {
  booking: Booking;
};

const STATUS_LABELS: Record<Booking['status'], { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: 'grape' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
};

function ClientBookingCard({ booking }: BookingCardProps) {
  const statusMeta = STATUS_LABELS[booking.status];

  const getActionLabel = () => {
    if (booking.status === 'upcoming') return 'Cancel';
    if (booking.status === 'completed') return 'Book Again';
    return null;
  };

  const actionLabel = getActionLabel();

  return (
    <Card withBorder radius="lg" shadow="sm">
      <Group gap="lg" align="flex-start">
        <Avatar src={booking.masterPhoto} radius="xl" size={72} />
        <Stack gap={8} flex={1}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text fw={600}>{booking.service}</Text>
              <Group gap={6} c="dimmed">
                <User size={14} />
                <Text size="sm">{booking.masterName}</Text>
              </Group>
            </Stack>
            <Badge variant="light" color={statusMeta.color}>
              {statusMeta.label}
            </Badge>
          </Group>
          <Group gap="lg" c="dimmed">
            <Group gap={4}>
              <Calendar size={14} />
              <Text size="sm">
                {new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </Text>
            </Group>
            <Group gap={4}>
              <Clock size={14} />
              <Text size="sm">{booking.time}</Text>
            </Group>
            <Group gap={4}>
              <MapPin size={14} />
              <Text size="sm">{booking.location}</Text>
            </Group>
          </Group>
        </Stack>
        <Stack align="flex-end" gap={8}>
          <Text fw={600} size="lg">
            $
            {booking.price}
          </Text>
          {actionLabel ? (
            <Button variant="outline" size="xs">
              {actionLabel}
            </Button>
          ) : null}
        </Stack>
      </Group>
    </Card>
  );
}

export default ClientBookingCard;
