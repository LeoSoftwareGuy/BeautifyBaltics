import {
  ActionIcon, Badge, Group, Stack, Text, Tooltip,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import { BookingStatus, FindBookingsResponse } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

const isNonEmpty = (value?: string | null): value is string => !!value && value.trim().length > 0;

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

export function renderLocation(booking: FindBookingsResponse) {
  const lineOne = [booking.locationAddressLine1, booking.locationAddressLine2]
    .filter(isNonEmpty)
    .join(', ');
  const lineTwo = [booking.locationPostalCode, booking.locationCity, booking.locationCountry]
    .filter(isNonEmpty)
    .join(', ');

  if (!lineOne && !lineTwo) {
    return <Text size="sm" c="dimmed">Location not provided</Text>;
  }

  return (
    <Stack gap={2}>
      <Text size="sm">{lineOne || lineTwo}</Text>
      {lineOne && lineTwo ? (
        <Text size="xs" c="dimmed">
          {lineTwo}
        </Text>
      ) : null}
    </Stack>
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

function canConfirmBooking(booking: FindBookingsResponse): boolean {
  return booking.status === BookingStatus.Requested;
}

type ActionsRendererProps = {
  booking: FindBookingsResponse;
  onConfirm: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  isConfirming: boolean;
  isCancelling: boolean;
};

export function ActionsRenderer({
  booking,
  onConfirm,
  onCancel,
  isConfirming,
  isCancelling,
}: ActionsRendererProps) {
  const showConfirm = canConfirmBooking(booking);
  const showCancel = canCancelBooking(booking);

  if (!showConfirm && !showCancel) {
    return <Text size="sm" c="dimmed">-</Text>;
  }

  return (
    <Group gap="xs">
      {showConfirm && (
        <Tooltip label="Confirm booking">
          <ActionIcon
            variant="light"
            color="green"
            size="sm"
            onClick={() => onConfirm(booking.id)}
            loading={isConfirming}
            disabled={isCancelling}
          >
            <IconCheck size={16} />
          </ActionIcon>
        </Tooltip>
      )}
      {showCancel && (
        <Tooltip label="Cancel booking">
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => onCancel(booking.id)}
            loading={isCancelling}
            disabled={isConfirming}
          >
            <IconX size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
