import {
  Anchor, Avatar, Badge, Button, Group, Stack, Text,
} from '@mantine/core';

import { useTranslateData } from '@/hooks/use-translate-data';
import { BookingStatus, FindBookingsResponse } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

export function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'teal';
    case BookingStatus.Requested:
      return 'yellow';
    case BookingStatus.Completed:
      return 'gray';
    case BookingStatus.Cancelled:
      return 'red';
    default:
      return 'gray';
  }
}

export function getStatusLabel(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.Requested:
      return 'PENDING';
    default:
      return status.toUpperCase();
  }
}

export function renderClient(booking: FindBookingsResponse) {
  return (
    <Group gap="sm" wrap="nowrap">
      <Avatar
        name={booking.clientName}
        color="initials"
        size="md"
        radius="xl"
      />
      <Stack gap={2}>
        <Text size="sm" fw={500}>{booking.clientName}</Text>
        <Text size="xs" c="dimmed">Client</Text>
      </Stack>
    </Group>
  );
}

function JobDetailsCell({ booking }: { booking: FindBookingsResponse }) {
  const { translateService, translateCategory } = useTranslateData();
  return (
    <Stack gap={2}>
      <Text size="sm" fw={500}>{translateService(booking.masterJobTitle)}</Text>
      <Text size="xs" c="dimmed">{translateCategory(booking.masterJobCategoryName)}</Text>
    </Stack>
  );
}

export function renderJobDetails(booking: FindBookingsResponse) {
  return <JobDetailsCell booking={booking} />;
}

export function renderDateTime(booking: FindBookingsResponse) {
  const date = datetime.formatDate(booking.scheduledAt);
  const time = datetime.formatTimeFromDate(booking.scheduledAt);

  return (
    <Stack gap={2}>
      <Text size="sm" fw={500}>{date}</Text>
      <Text size="xs" c="brand" fw={500}>{time}</Text>
    </Stack>
  );
}

export function renderPricing(booking: FindBookingsResponse) {
  return (
    <Stack gap={2}>
      <Text size="sm" fw={600}>
        €
        {booking.price.toFixed(2)}
      </Text>
      <Text size="xs" c="dimmed">{booking.duration}</Text>
    </Stack>
  );
}

export function renderStatus(booking: FindBookingsResponse) {
  return (
    <Badge
      color={getStatusColor(booking.status)}
      variant="light"
      size="sm"
      tt="uppercase"
    >
      {getStatusLabel(booking.status)}
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
  const isCompleted = booking.status === BookingStatus.Completed;

  if (isCompleted) {
    return (
      <Anchor size="xs" c="brand">
        View Invoice
      </Anchor>
    );
  }

  if (!showConfirm && !showCancel) {
    return <Text size="sm" c="dimmed">-</Text>;
  }

  return (
    <Group gap="xs" wrap="nowrap">
      {showConfirm && (
        <Button
          variant="filled"
          color="brand"
          size="xs"
          onClick={() => onConfirm(booking.id)}
          loading={isConfirming}
          disabled={isCancelling}
        >
          Confirm
        </Button>
      )}
      {showCancel && (
        <Button
          variant="outline"
          color="red"
          size="xs"
          onClick={() => onCancel(booking.id)}
          loading={isCancelling}
          disabled={isConfirming}
        >
          Cancel
        </Button>
      )}
    </Group>
  );
}
