import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconCalendar, IconPlus } from '@tabler/icons-react';

type QuickAddSlotProps = {
  selectedRange: [Date | null, Date | null];
  startTimeInput: string;
  endTimeInput: string;
  isLoading: boolean;
  onRangeChange: (dates: [Date | null, Date | null]) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onSave: () => void;
};

export function QuickAddSlot({
  selectedRange,
  startTimeInput,
  endTimeInput,
  isLoading,
  onRangeChange,
  onStartTimeChange,
  onEndTimeChange,
  onSave,
}: QuickAddSlotProps) {
  const canSave = Boolean(selectedRange[0] && selectedRange[1] && startTimeInput && endTimeInput);

  return (
    <Card withBorder radius="md" p="md">
      <Group gap="xs" mb="md">
        <ThemeIcon size="sm" variant="light" color="brand">
          <IconPlus size={14} />
        </ThemeIcon>
        <Text fw={600}>Quick Add Slot</Text>
      </Group>

      <Stack gap="md">
        <div>
          <Text size="xs" fw={500} c="dimmed" mb={4}>
            DATE RANGE
          </Text>
          <DatePickerInput
            type="range"
            value={selectedRange}
            onChange={(value) => {
              const rangeValue = (value ?? [null, null]) as [Date | null, Date | null];
              onRangeChange(rangeValue);
            }}
            placeholder="Select date range"
            minDate={new Date()}
            rightSection={<IconCalendar size={16} />}
            allowSingleDateInRange
          />
          <Text size="xs" c="dimmed" mt={4}>
            Select the first and last day, or double click for a single-day slot.
          </Text>
        </div>

        <Group grow>
          <div>
            <Text size="xs" fw={500} c="dimmed" mb={4}>
              START
            </Text>
            <TimeInput
              value={startTimeInput}
              onChange={(e) => onStartTimeChange(e.currentTarget.value)}
            />
          </div>
          <div>
            <Text size="xs" fw={500} c="dimmed" mb={4}>
              END
            </Text>
            <TimeInput
              value={endTimeInput}
              onChange={(e) => onEndTimeChange(e.currentTarget.value)}
            />
          </div>
        </Group>

        <Button
          fullWidth
          color="brand"
          onClick={onSave}
          loading={isLoading}
          disabled={!canSave}
        >
          Save Availability
        </Button>
      </Stack>
    </Card>
  );
}
