import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Badge, Group, Stack, Text, Tooltip,
} from '@mantine/core';
import { IconStar, IconX } from '@tabler/icons-react';

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
  return <BookingLocationCell booking={booking} />;
}

export function renderStatus(booking: FindBookingsResponse) {
  return <BookingStatusBadge booking={booking} />;
}

function canCancelBooking(booking: FindBookingsResponse): boolean {
  if (booking.status === BookingStatus.Cancelled || booking.status === BookingStatus.Completed) {
    return false;
  }
  const scheduledAt = new Date(booking.scheduledAt);
  const hoursUntilBooking = (scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilBooking >= 24;
}

function canRateBooking(booking: FindBookingsResponse): boolean {
  return booking.status === BookingStatus.Completed;
}

type BookingActionsRendererProps = {
  booking: FindBookingsResponse;
  onCancel: (bookingId: string) => void;
  onRate: (booking: FindBookingsResponse) => void;
  isCancelling: boolean;
  isRated?: boolean;
};

export function BookingActionsRenderer({
  booking,
  onCancel,
  onRate,
  isCancelling,
  isRated,
}: BookingActionsRendererProps) {
  const { t } = useTranslation();
  const showCancel = canCancelBooking(booking);
  const showRate = canRateBooking(booking) && !isRated;

  if (!showCancel && !showRate) {
    return <Text size="sm" c="dimmed">{isRated ? t('client.bookings.status.rated') : '-'}</Text>;
  }

  return (
    <Group gap="xs">
      {showCancel && (
        <Tooltip label={t('client.bookings.actions.cancel')}>
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
      )}
      {showRate && (
        <Tooltip label={t('client.bookings.actions.rate')}>
          <ActionIcon
            variant="light"
            color="yellow"
            size="sm"
            onClick={() => onRate(booking)}
          >
            <IconStar size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}

function BookingLocationCell({ booking }: { booking: FindBookingsResponse }) {
  const { t } = useTranslation();
  const lineOne = [booking.locationAddressLine1, booking.locationAddressLine2]
    .filter(isNonEmpty)
    .join(', ');
  const lineTwo = [booking.locationPostalCode, booking.locationCity, booking.locationCountry]
    .filter(isNonEmpty)
    .join(', ');

  if (!lineOne && !lineTwo) {
    return <Text size="sm" c="dimmed">{t('client.bookings.locationFallback')}</Text>;
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

const BOOKING_STATUS_KEYS: Record<BookingStatus, string> = {
  [BookingStatus.Confirmed]: 'client.bookings.status.confirmed',
  [BookingStatus.Requested]: 'client.bookings.status.requested',
  [BookingStatus.Completed]: 'client.bookings.status.completed',
  [BookingStatus.Cancelled]: 'client.bookings.status.cancelled',
};

function BookingStatusBadge({ booking }: { booking: FindBookingsResponse }) {
  const { t } = useTranslation();
  return (
    <Badge color={getStatusColor(booking.status)} variant="light">
      {t(BOOKING_STATUS_KEYS[booking.status] ?? 'client.bookings.status.requested')}
    </Badge>
  );
}
