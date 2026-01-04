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

  return (
    <Stack gap="lg" mt="xl">
      <Title order={2}>Book an Appointment</Title>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg">
            <Stack gap="sm">
              <Group gap="sm">
                <Calendar size={18} />
                <Text fw={600}>Select Date</Text>
              </Group>
              <DatePicker
                value={selectedDate}
                onChange={onDateChange}
                minDate={new Date()}
              />
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg">
            <Stack gap="md">
              <Group gap="sm">
                <Clock size={18} />
                <Text fw={600}>Available Time Slots</Text>
              </Group>
              <SimpleGrid cols={2} spacing="sm">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? 'filled' : 'outline'}
                    onClick={() => onSlotChange(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </SimpleGrid>
              <Button size="lg" disabled={isDisabled} onClick={onBook}>
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
