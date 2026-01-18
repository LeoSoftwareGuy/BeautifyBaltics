import {
  ActionIcon, Badge, Group, Stack, Text, Tooltip,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { BookingStatus, FindBookingsResponse } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

export function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'green';
    case BookingStatus.Requested:
      return 'yellow';
    case BookingStatus.Completed:
      return 'blue';
    case BookingStatus.Cancelled:
      return 'red';
    default:
      return 'gray';
  }
}

export function renderScheduledAt(booking: FindBookingsResponse) {
  return (
    <Stack gap={0}>
      <Text size="sm" fw={500}>
        {datetime.formatDate(booking.scheduledAt)}
      </Text>
      <Text size="xs" c="dimmed">
        {datetime.formatTimeFromDate(booking.scheduledAt)}
      </Text>
    </Stack>
  );
}

export function renderDuration(booking: FindBookingsResponse) {
  return <Text size="sm">{booking.duration}</Text>;
}

export function renderPrice(booking: FindBookingsResponse) {
  return (
    <Text size="sm" fw={500}>
      €
      {booking.price.toFixed(2)}
    </Text>
  );
}

export function renderStatus(booking: FindBookingsResponse) {
  return (
    <Badge color={getStatusColor(booking.status)} variant="light">
      {booking.status}
    </Badge>
  );
}

function canCancelBooking(booking: FindBookingsResponse): boolean {
  if (booking.status === BookingStatus.Cancelled || booking.status === BookingStatus.Completed) {
    return false;
  }
  const scheduledAt = new Date(booking.scheduledAt);
  const hoursUntilBooking = (scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilBooking >= 24;
}

type CancelActionRendererProps = {
  booking: FindBookingsResponse;
  onCancel: (bookingId: string) => void;
  isCancelling: boolean;
};

export function CancelActionRenderer({
  booking,
  onCancel,
  isCancelling,
}: CancelActionRendererProps) {
  const showCancel = canCancelBooking(booking);

  if (!showCancel) {
    return <Text size="sm" c="dimmed">-</Text>;
  }

  return (
    <Group gap="xs">
      <Tooltip label="Cancel booking">
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          onClick={() => onCancel(booking.id)}
          loading={isCancelling}
        >
          <IconX size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
