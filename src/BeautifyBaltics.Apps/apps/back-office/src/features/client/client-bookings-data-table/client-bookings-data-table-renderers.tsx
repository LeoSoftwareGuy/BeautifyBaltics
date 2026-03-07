import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Avatar, Badge, Box, Button, Drawer, Group, Stack, Text, Tooltip,
} from '@mantine/core';
import {
  IconCalendar, IconCheck, IconClock, IconCreditCard, IconMapPin, IconStar, IconX,
} from '@tabler/icons-react';

import useRoutedModal from '@/hooks/use-routed-modal';
import { useTranslateData } from '@/hooks/use-translate-data';
import { BookingStatus, FindBookingsResponse } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

import { ClientBookingRatingForm } from './client-booking-rating-form';

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
  isCancelling: boolean;
  isRated?: boolean;
  onForceComplete?: (bookingId: string) => void;
  isForceCompleting?: boolean;
};

export function BookingActionsRenderer({
  booking,
  onCancel,
  isCancelling,
  isRated,
  onForceComplete,
  isForceCompleting,
}: BookingActionsRendererProps) {
  const { t } = useTranslation();
  const showCancel = canCancelBooking(booking);
  const showRate = canRateBooking(booking) && !isRated;
  const showForceComplete = import.meta.env.DEV && booking.status === BookingStatus.Confirmed;
  const { onOpen: onOpenRating, opened: ratingOpened, onClose: onCloseRating } = useRoutedModal(`rate-booking-${booking.id}`);

  if (!showCancel && !showRate && !showForceComplete) {
    return <Text size="sm" c="dimmed">{isRated ? t('client.bookings.status.rated') : '-'}</Text>;
  }

  return (
    <>
      <Group gap="xs">
        {showForceComplete && (
          <Tooltip label="[DEV] Force complete">
            <ActionIcon
              variant="light"
              color="teal"
              size="sm"
              onClick={() => onForceComplete?.(booking.id)}
              loading={isForceCompleting}
            >
              <IconCheck size={16} />
            </ActionIcon>
          </Tooltip>
        )}
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
              onClick={onOpenRating}
            >
              <IconStar size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <Drawer
        opened={ratingOpened}
        onClose={onCloseRating}
        title={t('client.ratingModal.title')}
      >
        <Suspense fallback={null}>
          {ratingOpened ? (
            <ClientBookingRatingForm booking={booking} onCancel={onCloseRating} />
          ) : null}
        </Suspense>
      </Drawer>
    </>
  );
}

export function BookingLocationCell({
  locationAddressLine1, locationAddressLine2, locationPostalCode, locationCity, locationCountry,
}: FindBookingsResponse) {
  const { t } = useTranslation();
  const lineOne = [locationAddressLine1, locationAddressLine2]
    .filter(isNonEmpty)
    .join(', ');
  const lineTwo = [locationPostalCode, locationCity, locationCountry]
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

export function BookingStatusBadge({ status }: FindBookingsResponse) {
  const { t } = useTranslation();
  return (
    <Badge color={getStatusColor(status)} variant="light">
      {t(BOOKING_STATUS_KEYS[status] ?? 'client.bookings.status.requested')}
    </Badge>
  );
}

const STATUS_BADGE_STYLES: Record<BookingStatus, { bg: string; color: string }> = {
  [BookingStatus.Confirmed]: { bg: '#dcfce7', color: '#16a34a' },
  [BookingStatus.Completed]: { bg: '#dbeafe', color: '#1d4ed8' },
  [BookingStatus.Requested]: { bg: 'rgba(216,85,122,0.1)', color: '#d8557a' },
  [BookingStatus.Cancelled]: { bg: '#fee2e2', color: '#dc2626' },
};

type BookingMobileCardProps = {
  booking: FindBookingsResponse;
  onCancel: (bookingId: string) => void;
  isCancelling: boolean;
  isRated?: boolean;
};

export function BookingMobileCard({
  booking, onCancel, isCancelling, isRated,
}: BookingMobileCardProps) {
  const { t } = useTranslation();
  const { translateService } = useTranslateData();
  const showCancel = canCancelBooking(booking);
  const showRate = canRateBooking(booking) && !isRated;
  const { onOpen: onOpenRating, opened: ratingOpened, onClose: onCloseRating } = useRoutedModal(`rate-booking-mobile-${booking.id}`);

  const initials = booking.masterName.split(' ').map((n) => n[0]).join('').slice(0, 2)
    .toUpperCase();
  const badge = STATUS_BADGE_STYLES[booking.status];
  const isCompleted = booking.status === BookingStatus.Completed;
  const locationLine = [booking.locationAddressLine1, booking.locationCity].filter(Boolean).join(', ');

  return (
    <>
      <Box style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #f1f5f9',
        padding: 20,
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      >
        {/* Status badge */}
        <Box style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: badge.bg,
          color: badge.color,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 6,
        }}
        >
          {t(BOOKING_STATUS_KEYS[booking.status])}
        </Box>

        {/* Master + service */}
        <Group gap="md" mb="md" style={{ opacity: isCompleted ? 0.75 : 1 }}>
          <Avatar
            size={56}
            radius="xl"
            style={{
              background: 'rgba(216,85,122,0.1)', color: '#d8557a', fontWeight: 700, flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>
          <Stack gap={2}>
            <Text fw={700} size="sm">{booking.masterName}</Text>
            <Text size="sm" fw={500} style={{ color: '#d8557a' }}>{translateService(booking.masterJobTitle)}</Text>
          </Stack>
        </Group>

        {/* Details */}
        <Box style={{
          borderTop: '1px solid #f8fafc',
          borderBottom: '1px solid #f8fafc',
          padding: '12px 0',
          marginBottom: 16,
          opacity: isCompleted ? 0.75 : 1,
        }}
        >
          <Group gap="xl" wrap="wrap">
            <Group gap={6}>
              <IconCalendar size={16} color="#94a3b8" />
              <Text size="xs" c="dimmed">{datetime.formatDate(booking.scheduledAt)}</Text>
            </Group>
            {isCompleted ? (
              <Group gap={6}>
                <IconCreditCard size={16} color="#94a3b8" />
                <Text size="xs" c="dimmed">Paid Online</Text>
              </Group>
            ) : (
              <Group gap={6}>
                <IconClock size={16} color="#94a3b8" />
                <Text size="xs" c="dimmed">
                  {datetime.formatTimeFromDate(booking.scheduledAt)}
                  {' '}
                  (
                  {booking.duration}
                  )
                </Text>
              </Group>
            )}
          </Group>
          {locationLine && (
            <Group gap={6} mt={8}>
              <IconMapPin size={16} color="#94a3b8" />
              <Text size="xs" c="dimmed">{locationLine}</Text>
            </Group>
          )}
        </Box>

        {/* Price + actions */}
        <Group justify="space-between" align="center">
          <Text fw={700} size="lg">
            €
            {booking.price.toFixed(2)}
          </Text>
          <Group gap="xs">
            {booking.status === BookingStatus.Requested && !showCancel && (
              <Button size="xs" variant="default" disabled>Processing...</Button>
            )}
            {showCancel && (
              <Button size="xs" variant="subtle" color="red" onClick={() => onCancel(booking.id)} loading={isCancelling}>
                {t('client.bookings.actions.cancel')}
              </Button>
            )}
            {showRate && (
              <Button size="xs" color="pink" onClick={onOpenRating}>
                {t('client.bookings.actions.rate')}
              </Button>
            )}
          </Group>
        </Group>
      </Box>

      <Drawer opened={ratingOpened} onClose={onCloseRating} title={t('client.ratingModal.title')}>
        <Suspense fallback={null}>
          {ratingOpened && <ClientBookingRatingForm booking={booking} onCancel={onCloseRating} />}
        </Suspense>
      </Drawer>
    </>
  );
}
