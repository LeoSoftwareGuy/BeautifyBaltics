import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';

import { AvailabilitySlotType, BookingStatus } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

import { MasterSchedulePanelCalendarBooking } from './master-schedule-panel-calendar-booking';
import { MasterSchedulePanelCalendarSlot } from './master-schedule-panel-calendar-slot';

const HOUR_HEIGHT = 60;

type SlotData = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date;
  isRecurring?: boolean;
  slotType?: AvailabilitySlotType;
};

type BookingData = {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string;
  durationMinutes: number;
  date: Date;
  status: BookingStatus;
};

type CalendarGridProps = {
  weekDates: Date[];
  slots: SlotData[];
  bookings: BookingData[];
  onRemoveSlot: (id: string) => void;
};

export function MasterSchedulePanelCalendarGrid({
  weekDates, slots, bookings, onRemoveSlot,
}: CalendarGridProps) {
  const { t } = useTranslation();
  const dayLabels = useMemo(
    () => datetime.DAYS_OF_WEEK.map((day) => t(`master.timeSlots.calendar.days.${day.toLowerCase()}`)),
    [t],
  );

  // Get slots for a specific day and hour
  const getSlotsForCell = (date: Date, hour: number) => slots.filter((slot) => {
    const slotHour = parseInt(slot.startTime.split(':')[0], 10);
    return datetime.isSameDay(slot.date, date) && slotHour === hour;
  });

  // Get bookings for a specific day and hour
  const getBookingsForCell = (date: Date, hour: number) => bookings.filter((booking) => {
    const bookingHour = parseInt(booking.startTime.split(':')[0], 10);
    return datetime.isSameDay(booking.date, date) && bookingHour === hour;
  });

  return (
    <Card withBorder radius="md" p={0}>
      <ScrollArea h={600}>
        <Box style={{ minWidth: 800 }}>
          {/* Day Headers */}
          <Group
            gap={0}
            wrap="nowrap"
            style={{
              borderBottom: '1px solid var(--mantine-color-gray-2)',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10,
            }}
          >
            <Box
              w={80}
              p="sm"
              style={{ borderRight: '1px solid var(--mantine-color-gray-2)' }}
            />
            {weekDates.map((date, index) => {
              const isDateToday = datetime.isToday(date);
              return (
                <Box
                  key={date.toISOString()}
                  p="sm"
                  ta="center"
                  style={{
                    flex: 1,
                    borderRight: index < 6 ? '1px solid var(--mantine-color-gray-2)' : undefined,
                  }}
                >
                  <Text
                    size="xs"
                    fw={600}
                    c={isDateToday ? 'brand' : 'dimmed'}
                    tt="uppercase"
                  >
                    {dayLabels[index] ?? datetime.DAYS_OF_WEEK[index]}
                  </Text>
                  <Text
                    size="lg"
                    fw={isDateToday ? 700 : 500}
                    c={isDateToday ? 'brand' : undefined}
                  >
                    {dayjs(date).format('D')}
                  </Text>
                </Box>
              );
            })}
          </Group>

          {/* Time Rows */}
          {datetime.HOURS.map((hour) => (
            <Group
              key={hour}
              gap={0}
              wrap="nowrap"
              style={{ borderBottom: '1px solid var(--mantine-color-gray-1)' }}
            >
              <Box
                w={80}
                p="sm"
                h={HOUR_HEIGHT}
                style={{ borderRight: '1px solid var(--mantine-color-gray-2)' }}
              >
                <Text size="xs" c="dimmed">
                  {datetime.formatHour(hour)}
                </Text>
              </Box>
              {weekDates.map((date, index) => {
                const cellSlots = getSlotsForCell(date, hour);
                const cellBookings = getBookingsForCell(date, hour);
                return (
                  <Box
                    key={`${date.toISOString()}-${hour}`}
                    h={HOUR_HEIGHT}
                    style={{
                      flex: 1,
                      borderRight: index < 6 ? '1px solid var(--mantine-color-gray-1)' : undefined,
                      position: 'relative',
                    }}
                  >
                    {cellSlots.map((slot) => (
                      <MasterSchedulePanelCalendarSlot
                        key={slot.id}
                        id={slot.id}
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        isRecurring={slot.isRecurring}
                        slotType={slot.slotType}
                        onRemove={onRemoveSlot}
                      />
                    ))}
                    {cellBookings.map((booking) => (
                      <MasterSchedulePanelCalendarBooking
                        key={booking.id}
                        clientName={booking.clientName}
                        serviceName={booking.serviceName}
                        startTime={booking.startTime}
                        durationMinutes={booking.durationMinutes}
                        status={booking.status}
                      />
                    ))}
                  </Box>
                );
              })}
            </Group>
          ))}
        </Box>
      </ScrollArea>
    </Card>
  );
}
