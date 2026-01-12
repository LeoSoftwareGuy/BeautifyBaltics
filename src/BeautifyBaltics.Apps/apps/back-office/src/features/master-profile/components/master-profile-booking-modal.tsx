import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';

type BookingModalProps = {
  opened: boolean;
  date: Date | null;
  slot: string | null;
  address?: string | null;
  phone?: string | null;
  onClose: () => void;
};

function BookingModal({
  opened,
  date,
  slot,
  address,
  phone,
  onClose,
}: BookingModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm your booking"
      centered
    >
      <Stack gap="md">
        <Group gap="sm">
          <Calendar size={18} />
          <Text>{date?.toLocaleDateString()}</Text>
        </Group>
        <Group gap="sm">
          <Clock size={18} />
          <Text>{slot}</Text>
        </Group>
        <Group gap="sm">
          <MapPin size={18} />
          <Text>{address ?? 'Address not provided'}</Text>
        </Group>
        <Group gap="sm">
          <Phone size={18} />
          <Text>{phone ?? 'Phone not provided'}</Text>
        </Group>
        <Group gap="sm">
          <Button variant="default" onClick={onClose} fullWidth>
            Confirm Booking
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default BookingModal;
