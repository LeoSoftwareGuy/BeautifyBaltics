import {
  Button, SimpleGrid, Skeleton, Text,
} from '@mantine/core';

type MasterProfileTimeSlotsProps = {
  isLoading: boolean;
  availableSlots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
};

export default function MasterProfileTimeSlots({
  isLoading,
  availableSlots,
  selectedSlot,
  onSlotSelect,
}: MasterProfileTimeSlotsProps) {
  if (isLoading) {
    return (
      <SimpleGrid cols={2} spacing="sm">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={36} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="md">
        No available slots for this date
      </Text>
    );
  }

  return (
    <SimpleGrid cols={2} spacing="sm">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          variant={selectedSlot === slot ? 'filled' : 'outline'}
          color="orange"
          onClick={() => onSlotSelect(slot)}
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
  );
}
