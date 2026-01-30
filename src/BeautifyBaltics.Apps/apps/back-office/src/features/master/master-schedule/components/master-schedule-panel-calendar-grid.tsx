import {
  Box,
  Card,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';

import datetime from '@/utils/datetime';

import { MasterSchedulePanelCalendarSlot } from './master-schedule-panel-calendar-slot';

const HOUR_HEIGHT = 60;

type SlotData = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date;
  isRecurring?: boolean;
};

type CalendarGridProps = {
  weekDates: Date[];
  slots: SlotData[];
  onRemoveSlot: (id: string) => void;
};

export function MasterSchedulePanelCalendarGrid({ weekDates, slots, onRemoveSlot }: CalendarGridProps) {
  // Get slots for a specific day and hour
  const getSlotsForCell = (date: Date, hour: number) => slots.filter((slot) => {
    const slotHour = parseInt(slot.startTime.split(':')[0], 10);
    return datetime.isSameDay(slot.date, date) && slotHour === hour;
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
                    {datetime.DAYS_OF_WEEK[index]}
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
                        onRemove={onRemoveSlot}
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
