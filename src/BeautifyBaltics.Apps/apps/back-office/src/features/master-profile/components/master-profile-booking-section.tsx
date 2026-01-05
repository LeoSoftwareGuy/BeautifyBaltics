import {
  Button,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Calendar, Clock } from 'lucide-react';

type BookingSectionProps = {
  availableSlots: string[];
  selectedDate: Date | null;
  selectedSlot: string | null;
  onDateChange: (value: Date | null) => void;
  onSlotChange: (slot: string) => void;
  onBook: () => void;
};

function BookingSection({
  availableSlots,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  onBook,
}: BookingSectionProps) {
  const isDisabled = !selectedDate || !selectedSlot;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Stack gap="lg" mt="xl">
      <Title order={2}>Book an Appointment</Title>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" h="100%">
            <Stack gap="md">
              <Stack gap={4}>
                <Group gap="xs">
                  <Calendar size={20} />
                  <Text fw={600} size="lg">Select Date</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  Choose your preferred appointment date
                </Text>
              </Stack>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '12px',
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
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" h="100%">
            <Stack gap="md">
              <Stack gap={4}>
                <Group gap="xs">
                  <Clock size={20} />
                  <Text fw={600} size="lg">Available Time Slots</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {selectedDate ? formatDate(selectedDate) : 'Select a date first'}
                </Text>
              </Stack>
              <SimpleGrid cols={2} spacing="sm">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? 'filled' : 'outline'}
                    color={selectedSlot === slot ? 'orange' : 'orange'}
                    onClick={() => onSlotChange(slot)}
                    radius="md"
                    styles={{
                      root: {
                        fontWeight: selectedSlot === slot ? 700 : 500,
                      },
                    }}
                  >
                    {slot}
                  </Button>
                ))}
              </SimpleGrid>
              <Button
                size="lg"
                disabled={isDisabled}
                onClick={onBook}
                color="pink"
                radius="md"
                fullWidth
                mt="xl"
                styles={{
                  root: {
                    fontSize: '1rem',
                  },
                }}
              >
                Book Appointment
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default BookingSection;
