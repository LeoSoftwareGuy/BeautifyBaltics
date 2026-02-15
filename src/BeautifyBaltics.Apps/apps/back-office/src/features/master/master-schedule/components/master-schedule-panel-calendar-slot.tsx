import {
  ActionIcon,
  Menu,
  Paper,
  Text,
} from '@mantine/core';
import { IconCoffee, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { AvailabilitySlotType } from '@/state/endpoints/api.schemas';
import datetime from '@/utils/datetime';

const HOUR_HEIGHT = 60; // Height of each hour row in pixels
const MIN_SLOT_HEIGHT = 36;

type CalendarSlotProps = {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  slotType?: AvailabilitySlotType;
  onRemove: (id: string) => void;
};

export function MasterSchedulePanelCalendarSlot({
  id,
  startTime,
  endTime,
  isRecurring = false,
  slotType = AvailabilitySlotType.Available,
  onRemove,
}: CalendarSlotProps) {
  const { t } = useTranslation();
  const startMinutes = datetime.parseTimeToMinutes(startTime);
  const endMinutes = datetime.parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  const isBreak = slotType === AvailabilitySlotType.Break;

  let textColor: string;

  if (isBreak) {
    textColor = 'dark';
  } else if (isRecurring) {
    textColor = 'brand';
  } else {
    textColor = 'white';
  }

  // Calculate height based on duration (60 minutes = HOUR_HEIGHT pixels)
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  // Calculate top offset based on minutes past the hour
  const minutesPastHour = startMinutes % 60;
  const topOffset = (minutesPastHour / 60) * HOUR_HEIGHT;

  const getBackgroundStyle = () => {
    if (isBreak) {
      return {
        backgroundColor: 'var(--mantine-color-gray-2)',
        border: '2px dashed var(--mantine-color-gray-5)',
      };
    }
    if (isRecurring) {
      return {
        backgroundColor: 'transparent',
        border: '2px dashed var(--mantine-color-brand-5)',
      };
    }
    return {
      backgroundColor: 'var(--mantine-color-brand-5)',
      border: 'none',
    };
  };

  return (
    <Paper
      p="xs"
      radius="sm"
      style={{
        ...getBackgroundStyle(),
        position: 'absolute',
        top: topOffset,
        left: 4,
        right: 4,
        height: Math.max(height - 4, MIN_SLOT_HEIGHT),
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 4,
          height: '100%',
        }}
      >
        {isBreak && height > 40 && (
          <IconCoffee size={14} color="var(--mantine-color-gray-6)" />
        )}
        <Text size="xs" fw={600} c={textColor} lh={1}>
          {startTime}
        </Text>
        <Text size="xs" fw={500} c={textColor} lh={1} style={{ opacity: 0.85 }}>
          {endTime}
        </Text>
        {isBreak && height > 50 && (
          <Text size="xs" c="dimmed" lh={1}>
            {t('master.timeSlots.calendar.break')}
          </Text>
        )}
        {isRecurring && !isBreak && height > 40 && (
          <Text size="xs" c="brand">
            {t('master.timeSlots.calendar.weekly')}
          </Text>
        )}
      </div>

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon
            size="xs"
            variant="subtle"
            color={isBreak ? 'dark' : textColor}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
            }}
          >
            <IconDotsVertical size={12} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={14} />}
            onClick={() => onRemove(id)}
          >
            {t('master.timeSlots.calendar.removeSlot')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
}
