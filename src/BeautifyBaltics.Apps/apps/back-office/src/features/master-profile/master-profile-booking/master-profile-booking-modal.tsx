import { useState } from 'react';
import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Briefcase,
  Check,
  DollarSign,
  MapPin,
  Phone,
} from 'lucide-react';

import { FindMasterAvailabilitiesResponsePagedResponse, MasterJobDTO } from '@/state/endpoints/api.schemas';
import { getFindBookingsQueryKey, useCreateBooking } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

type BookingModalProps = {
  opened: boolean;
  masterId: string;
  availabilityId: string | null;
  job: MasterJobDTO | null;
  address?: string | null;
  phone?: string | null;
  onClose: () => void;
};

function BookingModal({
  opened,
  masterId,
  availabilityId,
  job,
  address,
  phone,
  onClose,
}: BookingModalProps) {
  const queryClient = useQueryClient();

  const { data: user } = useGetUser();

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const availabilityKeyPrefix = `/api/v1/masters/${masterId}/availability`;

  const removeSlotFromCache = () => {
    if (!availabilityId) return;

    queryClient.setQueriesData<FindMasterAvailabilitiesResponsePagedResponse | undefined>(
      {
        predicate: (query) => Array.isArray(query.queryKey)
          && query.queryKey.length > 0
          && query.queryKey[0] === availabilityKeyPrefix,
      },
      (old) => {
        if (!old?.items?.length) return old;
        const filteredItems = old.items.filter((slot) => slot.id !== availabilityId);
        if (filteredItems.length === old.items.length) return old;

        return {
          ...old,
          items: filteredItems,
          totalItemCount: Math.max(0, old.totalItemCount - (old.items.length - filteredItems.length)),
        };
      },
    );
  };

  const { mutate: createBooking, isPending } = useCreateBooking({
    mutation: {
      onSuccess: async () => {
        setIsSuccess(true);
        setError('');

        await queryClient.invalidateQueries({
          queryKey: getFindBookingsQueryKey(),
        });

        removeSlotFromCache();

        await queryClient.invalidateQueries({
          predicate: (query) => Array.isArray(query.queryKey)
            && query.queryKey.length > 0
            && query.queryKey[0] === availabilityKeyPrefix,
        });

        notifications.show({
          title: 'Booking created',
          message: 'Your booking was successfully created',
          color: 'green',
        });
      },
      onError: (err) => {
        setError(err?.detail ?? 'Failed to create booking. Please try again.');
        notifications.show({
          title: 'Booking failed',
          message: err?.detail ?? 'Failed to create booking',
          color: 'red',
        });
      },
    },
  });

  const handleConfirm = () => {
    if (!availabilityId || !job || !user?.id) return;

    createBooking({
      data: {
        masterId,
        clientId: user.id,
        masterJobId: job.id,
        masterAvailabilityId: availabilityId,
      },
    });
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal
        opened={opened}
        onClose={handleClose}
        title="Booking Confirmed"
        centered
      >
        <Stack gap="md" align="center" py="md">
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--mantine-color-green-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <Check size={32} color="var(--mantine-color-green-6)" />
          </div>
          <Text size="lg" fw={500} ta="center">
            Your booking has been submitted!
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            The master will review your request and confirm the appointment.
          </Text>
          <Button onClick={handleClose} fullWidth mt="md">
            Done
          </Button>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Confirm your booking"
      centered
    >
      <Stack gap="md">
        {error && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            {error}
          </Alert>
        )}

        {job && (
          <Group gap="sm">
            <Briefcase size={18} />
            <div>
              <Text fw={500}>{job.title}</Text>
              <Text size="sm" c="dimmed">
                {job.durationMinutes}
                {' '}
                minutes
              </Text>
            </div>
          </Group>
        )}

        {job && (
          <Group gap="sm">
            <DollarSign size={18} />
            <Text fw={500}>
              $
              {job.price}
            </Text>
          </Group>
        )}

        <Group gap="sm">
          <MapPin size={18} />
          <Text>{address ?? 'Address not provided'}</Text>
        </Group>

        <Group gap="sm">
          <Phone size={18} />
          <Text>{phone ?? 'Phone not provided'}</Text>
        </Group>

        <Group gap="sm" mt="md">
          <Button
            variant="default"
            onClick={handleClose}
            flex={1}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            flex={1}
            disabled={isPending || !user?.id || !availabilityId || !job}
            leftSection={isPending ? <Loader size={16} /> : null}
          >
            {isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default BookingModal;
