import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

import { useTranslateData } from '@/hooks/use-translate-data';
import { MasterJobDTO } from '@/state/endpoints/api.schemas';
import { getFindBookingsQueryKey, useCreateBooking } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

type BookingModalProps = {
  opened: boolean;
  masterId: string;
  scheduledAt: Date | null;
  job: MasterJobDTO | null;
  address?: string | null;
  phone?: string | null;
  onClose: () => void;
};

function BookingModal({
  opened,
  masterId,
  scheduledAt,
  job,
  address,
  phone,
  onClose,
}: BookingModalProps) {
  const { t } = useTranslation();
  const { translateService } = useTranslateData();
  const queryClient = useQueryClient();

  const { data: user } = useGetUser();

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const availableSlotsKeyPrefix = `/api/v1/masters/${masterId}/available-slots`;

  const { mutate: createBooking, isPending } = useCreateBooking({
    mutation: {
      onSuccess: async () => {
        setIsSuccess(true);
        setError('');

        await queryClient.invalidateQueries({
          queryKey: getFindBookingsQueryKey(),
        });

        await queryClient.invalidateQueries({
          predicate: (query) => Array.isArray(query.queryKey)
            && query.queryKey.length > 0
            && typeof query.queryKey[0] === 'string'
            && query.queryKey[0].includes(availableSlotsKeyPrefix),
        });

        notifications.show({
          title: t('masterProfile.bookingModal.notifications.successTitle'),
          message: t('masterProfile.bookingModal.notifications.successMessage'),
          color: 'green',
        });
      },
      onError: (err) => {
        setError(err?.detail ?? t('masterProfile.bookingModal.notifications.failMessage'));
        notifications.show({
          title: t('masterProfile.bookingModal.notifications.failTitle'),
          message: err?.detail ?? t('masterProfile.bookingModal.notifications.failMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleConfirm = () => {
    if (!scheduledAt || !job || !user?.id) return;

    createBooking({
      data: {
        masterId,
        clientId: user.id,
        masterJobId: job.id,
        scheduledAt,
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
        title={t('masterProfile.bookingModal.confirmedTitle')}
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
            {t('masterProfile.bookingModal.submitted')}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {t('masterProfile.bookingModal.submittedDetail')}
          </Text>
          <Button onClick={handleClose} fullWidth mt="md">
            {t('actions.done')}
          </Button>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('masterProfile.bookingModal.confirmTitle')}
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
              <Text fw={500}>{translateService(job.title)}</Text>
              <Text size="sm" c="dimmed">
                {job.durationMinutes}
                {' '}
                {t('masterProfile.bookingModal.minutes')}
              </Text>
            </div>
          </Group>
        )}

        {job && (
          <Group gap="sm">
            <DollarSign size={18} />
            <Text fw={500}>
              {job.price}
            </Text>
          </Group>
        )}

        <Group gap="sm">
          <MapPin size={18} />
          <Text>{address ?? t('masterProfile.bookingModal.addressFallback')}</Text>
        </Group>

        <Group gap="sm">
          <Phone size={18} />
          <Text>{phone ?? t('masterProfile.bookingModal.phoneFallback')}</Text>
        </Group>

        <Group gap="sm" mt="md">
          <Button
            variant="default"
            onClick={handleClose}
            flex={1}
            disabled={isPending}
          >
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            flex={1}
            disabled={isPending || !user?.id || !scheduledAt || !job}
            leftSection={isPending ? <Loader size={16} /> : null}
          >
            {isPending ? t('masterProfile.bookingModal.booking') : t('masterProfile.bookingModal.confirmBooking')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default BookingModal;
