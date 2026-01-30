import {
  Drawer,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';

import datetime from '@/utils/datetime';

type SlotData = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date;
  isRecurring?: boolean;
};

type UpcomingDrawerProps = {
  opened: boolean;
  onClose: () => void;
  slots: SlotData[];
};

export function MasterSchedulePanelUpcomingDrawer({ opened, onClose, slots }: UpcomingDrawerProps) {
  const futureSlots = slots
    .filter((slot) => dayjs(slot.date).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Upcoming Availability"
      size="lg"
      position="right"
      overlayProps={{ opacity: 0.3 }}
    >
      {futureSlots.length === 0 ? (
        <Text size="sm" c="dimmed">
          No upcoming availability slots.
        </Text>
      ) : (
        <ScrollArea style={{ height: 'calc(100vh - 160px)' }} type="auto">
          <Stack gap="sm" pr="sm">
            {futureSlots.map((slot) => (
              <Paper
                key={slot.id + slot.date.toISOString()}
                p="sm"
                radius="md"
                withBorder
              >
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      {datetime.formatDate(slot.date)}
                    </Text>
                    <Text fw={600}>
                      {slot.startTime}
                      {' - '}
                      {slot.endTime}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {dayjs(slot.date).format('dddd')}
                    </Text>
                  </div>
                  <Text size="xs" c="dimmed">
                    Starts in
                    {' '}
                    {datetime.formatDuration(datetime.minutesFromNow(slot.date))}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>
      )}
    </Drawer>
  );
}
