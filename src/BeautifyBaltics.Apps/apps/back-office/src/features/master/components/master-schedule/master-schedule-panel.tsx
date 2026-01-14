import {
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconClock, IconTrash } from '@tabler/icons-react';

interface MasterSchedulePanelProps {
  selectedDate: Date | null;
  onDateChange: (value: Date | null) => void;
  slotInput: string;
  onSlotInputChange: (value: string) => void;
  slots: string[];
  onAddSlot: () => void;
  onRemoveSlot: (time: string) => void;
  isLoading?: boolean;
}

export function MasterSchedulePanel({
  selectedDate,
  onDateChange,
  slotInput,
  onSlotInputChange,
  slots,
  onAddSlot,
  onRemoveSlot,
  isLoading = false,
}: MasterSchedulePanelProps) {
  return (
    <Grid gutter="lg">
      {/* Left Column - Calendar */}
      <Grid.Col span={6}>
        <Card withBorder h="100%" radius="md">
          <Stack gap="md" h="100%">
            <div>
              <Title order={3}>Select Date</Title>
              <Text c="dimmed" size="sm">
                Choose a date to manage time slots
              </Text>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'center', flex: 1, alignItems: 'flex-start', paddingTop: '20px',
            }}
            >
              <div style={{
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: '8px',
                padding: '12px',
              }}
              >
                <DatePicker
                  value={selectedDate}
                  onChange={(value) => {
                    if (typeof value === 'string') {
                      onDateChange(new Date(value));
                    } else {
                      onDateChange(value);
                    }
                  }}
                  minDate={new Date()}
                />
              </div>
            </div>
          </Stack>
        </Card>
      </Grid.Col>

      {/* Right Column - Time Slots */}
      <Grid.Col span={6}>
        <Card withBorder h="100%" radius="md">
          <Stack gap="md" h="100%">
            <div>
              <Title order={3}>Time Slots</Title>
              <Text c="dimmed" size="sm">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  : 'No date selected'}
              </Text>
            </div>

            {/* Add Time Slot Input */}
            <div>
              <Text size="sm" fw={500} mb="xs">
                Add Time Slot
              </Text>
              <Group gap="sm">
                <TextInput
                  type="time"
                  value={slotInput}
                  onChange={(event) => onSlotInputChange(event.currentTarget.value)}
                  placeholder="--:--"
                  rightSection={<IconClock size={16} />}
                  style={{ flex: 1 }}
                />
                <Button
                  onClick={onAddSlot}
                  disabled={!slotInput || !selectedDate || isLoading}
                  loading={isLoading}
                  color="pink"
                >
                  Add
                </Button>
              </Group>
            </div>

            {/* Available Slots List */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
            }}
            >
              <Text size="sm" fw={500} mb="xs">
                Available Slots (
                {slots.length}
                )
              </Text>
              <Stack gap="sm" style={{ flex: 1, overflowY: 'auto' }}>
                {slots.length === 0 ? (
                  <Text c="dimmed" size="sm" ta="center" py="xl">
                    No time slots available
                  </Text>
                ) : (
                  slots.map((slot) => (
                    <Group
                      key={slot}
                      justify="space-between"
                      p="md"
                      bg="gray.0"
                      style={{
                        borderRadius: 8,
                        border: '1px solid var(--mantine-color-gray-2)',
                      }}
                    >
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="gray">
                          <IconClock size={14} />
                        </ThemeIcon>
                        <Text fw={500}>{slot}</Text>
                      </Group>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => onRemoveSlot(slot)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    </Group>
                  ))
                )}
              </Stack>
            </div>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
