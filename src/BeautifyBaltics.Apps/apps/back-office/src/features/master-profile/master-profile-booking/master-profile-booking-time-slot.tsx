import { useTranslation } from 'react-i18next';
import {
  Button, SimpleGrid, Skeleton, Text,
} from '@mantine/core';

export type AvailabilitySlot = {
  id: string;
  label: string;
};

type MasterProfileTimeSlotsProps = {
  isLoading: boolean;
  availableSlots: AvailabilitySlot[];
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string) => void;
};

export default function MasterProfileTimeSlots({
  isLoading,
  availableSlots,
  selectedSlotId,
  onSlotSelect,
}: MasterProfileTimeSlotsProps) {
  const { t } = useTranslation();

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
        {t('masterProfile.booking.noSlots')}
      </Text>
    );
  }

  return (
    <SimpleGrid cols={2} spacing="sm">
      {availableSlots.map((slot) => (
        <Button
          key={slot.id}
          variant={selectedSlotId === slot.id ? 'filled' : 'outline'}
          color="orange"
          onClick={() => onSlotSelect(slot.id)}
          radius="md"
          styles={{
            root: {
              fontWeight: selectedSlotId === slot.id ? 700 : 500,
            },
          }}
        >
          {slot.label}
        </Button>
      ))}
    </SimpleGrid>
  );
}
