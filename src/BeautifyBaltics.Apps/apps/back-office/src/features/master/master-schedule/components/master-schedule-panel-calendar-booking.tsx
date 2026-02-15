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

export function MasterSchedulePanelCalendarBooking({
  clientName,
  serviceName,
  startTime,
  durationMinutes,
  status,
}: CalendarBookingProps) {
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
        backgroundColor: 'var(--mantine-color-blue-1)',
        border: '1px solid var(--mantine-color-blue-4)',
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
          <Text size="xs" fw={600} c="blue.8" lh={1} truncate>
            {clientName}
          </Text>
          <Badge
            variant="light"
            color={getStatusColor(status)}
            size="xs"
            style={{ flexShrink: 0 }}
          >
            {status}
          </Badge>
        </div>
        {height > 40 && (
          <Text size="xs" c="blue.6" lh={1} truncate>
            {serviceName}
          </Text>
        )}
        <Text size="xs" c="blue.5" lh={1}>
          {startTime}
          {' - '}
          {endTime}
        </Text>
      </div>
    </Paper>
  );
}
