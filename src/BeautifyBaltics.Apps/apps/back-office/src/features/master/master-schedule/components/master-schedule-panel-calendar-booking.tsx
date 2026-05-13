import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Paper,
  Text,
} from '@mantine/core';

import { BookingStatus } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

const HOUR_HEIGHT = 60;
const MIN_SLOT_HEIGHT = 36;

type CalendarBookingProps = {
  clientName: string;
  serviceName: string;
  startTime: string;
  durationMinutes: number;
  status: BookingStatus;
};

function getStatusColor(status: BookingStatus) {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'teal';
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

function getStatusBackground(status: BookingStatus) {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'var(--mantine-color-teal-6)';
    case BookingStatus.Requested:
      return 'var(--mantine-color-yellow-6)';
    case BookingStatus.Completed:
      return 'var(--mantine-color-green-6)';
    case BookingStatus.Cancelled:
      return 'var(--mantine-color-red-6)';
    default:
      return 'var(--mantine-color-gray-6)';
  }
}

export function MasterSchedulePanelCalendarBooking({
  clientName,
  serviceName,
  startTime,
  durationMinutes,
  status,
}: CalendarBookingProps) {
  const { t } = useTranslation();
  const statusLabels = useMemo(
    () => ({
      [BookingStatus.Requested]: t('master.bookings.status.requested'),
      [BookingStatus.Confirmed]: t('master.bookings.status.confirmed'),
      [BookingStatus.Completed]: t('master.bookings.status.completed'),
      [BookingStatus.Cancelled]: t('master.bookings.status.cancelled'),
    }),
    [t],
  );
  const startMinutes = datetime.parseTimeToMinutes(startTime);
  const height = (durationMinutes / 60) * HOUR_HEIGHT;
  const minutesPastHour = startMinutes % 60;
  const topOffset = (minutesPastHour / 60) * HOUR_HEIGHT;

  const endMinutes = startMinutes + durationMinutes;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

  return (
    <Paper
      p="xs"
      radius="sm"
      style={{
        backgroundColor: getStatusBackground(status),
        border: 'none',
        position: 'absolute',
        top: topOffset,
        left: 4,
        right: 4,
        height: Math.max(height - 4, MIN_SLOT_HEIGHT),
        zIndex: 6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="xs" fw={600} c="white" lh={1} truncate>
            {clientName}
          </Text>
          <Badge
            variant="white"
            color={getStatusColor(status)}
            size="xs"
            style={{ flexShrink: 0 }}
          >
            {statusLabels[status] ?? status}
          </Badge>
        </div>
        {height > 40 && (
          <Text size="xs" c="white" lh={1} truncate style={{ opacity: 0.85 }}>
            {serviceName}
          </Text>
        )}
        <Text size="xs" c="white" lh={1} style={{ opacity: 0.85 }}>
          {startTime}
          {' - '}
          {endTime}
        </Text>
      </div>
    </Paper>
  );
}
