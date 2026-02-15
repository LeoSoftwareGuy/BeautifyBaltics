import { useMemo } from 'react';
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconRepeat } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import datetime from '@/utils/datetime';

type SlotData = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date;
  isRecurring?: boolean;
};

type UpcomingSlotsProps = {
  slots: SlotData[];
  onViewAll?: () => void;
};

export function MasterSchedulePanelUpcomingSlots({ slots, onViewAll }: UpcomingSlotsProps) {
  const { t } = useTranslation();
  const { upcomingSlots, futureCount } = useMemo(() => {
    const now = dayjs();
    const in48Hours = now.add(48, 'hour');
    const futureSlots = slots.filter((slot) => dayjs(slot.date).isAfter(now));
    const next48h = futureSlots
      .filter((slot) => dayjs(slot.date).isBefore(in48Hours))
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
      .slice(0, 5);

    return {
      upcomingSlots: next48h,
      futureCount: futureSlots.length,
    };
  }, [slots]);

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="xs" fw={600} c="dimmed" tt="uppercase">
          {t('master.timeSlots.upcoming.title')}
        </Text>
        <Text size="xs" c="dimmed">
          {t('master.timeSlots.upcoming.count', { count: upcomingSlots.length })}
        </Text>
      </Group>

      <Stack gap="sm">
        {upcomingSlots.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            {t('master.timeSlots.upcoming.empty')}
          </Text>
        ) : (
          upcomingSlots.map((slot) => {
            const isSlotToday = datetime.isToday(slot.date);
            const isSlotTomorrow = datetime.isTomorrow(slot.date);
            const startsIn = datetime.minutesFromNow(slot.date);

            let dateLabel = datetime.formatDate(slot.date);
            if (isSlotToday) dateLabel = t('master.timeSlots.upcoming.today');
            else if (isSlotTomorrow) dateLabel = t('master.timeSlots.upcoming.tomorrow');

            return (
              <Paper
                key={slot.id}
                p="sm"
                radius="md"
                style={{
                  border: '1px solid var(--mantine-color-gray-2)',
                }}
              >
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    {dateLabel}
                  </Text>
                  {slot.isRecurring && (
                    <ThemeIcon size="xs" variant="light" color="brand">
                      <IconRepeat size={10} />
                    </ThemeIcon>
                  )}
                </Group>
                <Text fw={600}>
                  {slot.startTime}
                  {' - '}
                  {slot.endTime}
                </Text>
                {slot.isRecurring && (
                  <Text size="xs" c="brand">
                    {t('master.timeSlots.upcoming.recurring')}
                  </Text>
                )}
                {!slot.isRecurring && startsIn > 0 && (
                  <Text size="xs" c="dimmed">
                    {t('master.timeSlots.upcoming.startsIn', { duration: datetime.formatDuration(startsIn) })}
                  </Text>
                )}
              </Paper>
            );
          })
        )}

        {futureCount > upcomingSlots.length && (
          <Button variant="subtle" color="brand" size="xs" onClick={onViewAll}>
            {t('master.timeSlots.upcoming.viewAll')}
          </Button>
        )}
      </Stack>
    </div>
  );
}
