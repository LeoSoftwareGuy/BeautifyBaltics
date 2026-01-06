import {
  Avatar, Badge, Button, Card, Group, Stack, Text,
} from '@mantine/core';
import {
  Calendar, Clock, MapPin, User,
} from 'lucide-react';

import { BookingStatus } from '@/state/endpoints/api.schemas';

import type { Booking } from '../data';

type BookingCardProps = {
  booking: Booking;
};

const STATUS_LABELS: Record<BookingStatus, { label: string; color: string }> = {
  [BookingStatus.Requested]: { label: 'Upcoming', color: 'grape' },
  [BookingStatus.Confirmed]: { label: 'Confirmed', color: 'yellow' },
  [BookingStatus.Completed]: { label: 'Completed', color: 'green' },
  [BookingStatus.Cancelled]: { label: 'Cancelled', color: 'red' },
};

function ClientBookingCard({ booking }: BookingCardProps) {
  const statusMeta = STATUS_LABELS[booking.status];

  const getActionLabel = () => {
    if (booking.status === BookingStatus.Requested) return 'Cancel';
    if (booking.status === BookingStatus.Completed) return 'Book Again';
    return null;
  };

  const actionLabel = getActionLabel();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <Avatar src={booking.masterPhoto} size="lg" radius="xl">
              <User size={24} />
            </Avatar>
            <div>
              <Text fw={600} size="lg">
                {booking.service}
              </Text>
              <Text size="sm" c="dimmed">
                {booking.masterName}
              </Text>
            </div>
          </Group>
          <Badge color={statusMeta.color} variant="light">
            {statusMeta.label}
          </Badge>
        </Group>

        <Stack gap="xs">
          <Group gap="xs">
            <Calendar size={16} />
            <Text size="sm">
              {new Date(booking.date).toLocaleDateString(undefined, {
                dateStyle: 'medium',
              })}
            </Text>
          </Group>

          <Group gap="xs">
            <Clock size={16} />
            <Text size="sm">{booking.time}</Text>
          </Group>

          <Group gap="xs">
            <MapPin size={16} />
            <Text size="sm">{booking.location}</Text>
          </Group>
        </Stack>

        <Group justify="space-between" align="center">
          <Text fw={700} size="xl">
            $
            {booking.price}
          </Text>
          {actionLabel ? (
            <Button variant="outline" size="sm">
              {actionLabel}
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Card>
  );
}

export default ClientBookingCard;
