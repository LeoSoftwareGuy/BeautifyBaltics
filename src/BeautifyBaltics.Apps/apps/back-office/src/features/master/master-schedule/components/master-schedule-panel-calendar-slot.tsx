import {
  ActionIcon,
  Menu,
  Paper,
  Text,
} from '@mantine/core';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';

import datetime from '@/utils/datetime';

const HOUR_HEIGHT = 60; // Height of each hour row in pixels
const MIN_SLOT_HEIGHT = 36;

type CalendarSlotProps = {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  onRemove: (id: string) => void;
};

export function MasterSchedulePanelCalendarSlot({
  id,
  startTime,
  endTime,
  isRecurring = false,
  onRemove,
}: CalendarSlotProps) {
  const startMinutes = datetime.parseTimeToMinutes(startTime);
  const endMinutes = datetime.parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  const textColor = isRecurring ? 'brand' : 'white';

  // Calculate height based on duration (60 minutes = HOUR_HEIGHT pixels)
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  // Calculate top offset based on minutes past the hour
  const minutesPastHour = startMinutes % 60;
  const topOffset = (minutesPastHour / 60) * HOUR_HEIGHT;

  return (
    <Paper
      p="xs"
      radius="sm"
      style={{
        backgroundColor: isRecurring ? 'transparent' : 'var(--mantine-color-brand-5)',
        border: isRecurring ? '2px dashed var(--mantine-color-brand-5)' : 'none',
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
        <Text size="xs" fw={600} c={textColor} lh={1}>
          {startTime}
        </Text>
        <Text size="xs" fw={500} c={textColor} lh={1} style={{ opacity: 0.85 }}>
          {endTime}
        </Text>
        {isRecurring && height > 40 && (
          <Text size="xs" c="brand">
            Weekly
          </Text>
        )}
      </div>

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon
            size="xs"
            variant="subtle"
            color={textColor}
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
            Remove slot
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
}
