import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Group,
  Loader,
  Modal,
  Rating,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Check, Star } from 'lucide-react';

import { useTranslateData } from '@/hooks/use-translate-data';
import { FindBookingsResponse } from '@/state/endpoints/api.schemas';
import { getFindBookingsQueryKey } from '@/state/endpoints/bookings';
import { getFindRatingsQueryKey, useCreateRating } from '@/state/endpoints/ratings';

type ClientBookingRatingModalProps = {
  opened: boolean;
  booking: FindBookingsResponse | null;
  onClose: () => void;
};

export function ClientBookingRatingModal({
  opened,
  booking,
  onClose,
}: ClientBookingRatingModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { translateService } = useTranslateData();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const { mutate: createRating, isPending } = useCreateRating({
    mutation: {
      onSuccess: async () => {
        setIsSuccess(true);
        setError('');

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getFindBookingsQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: getFindRatingsQueryKey(),
          }),
        ]);

        notifications.show({
          title: t('client.ratingModal.successTitle'),
          message: t('client.ratingModal.successMessage'),
          color: 'green',
        });
      },
      onError: (err: any) => {
        setError(err?.detail ?? t('client.ratingModal.errorMessage'));
        notifications.show({
          title: t('client.ratingModal.errorTitle'),
          message: err?.detail ?? t('client.ratingModal.errorFallback'),
          color: 'red',
        });
      },
    },
  });

  const handleSubmit = () => {
    if (!booking || rating === 0) return;

    createRating({
      data: {
        bookingId: booking.id,
        value: rating,
        comment: comment.trim() || undefined,
      },
    });
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    setRating(0);
    setComment('');
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal
        opened={opened}
        onClose={handleClose}
        title={t('client.ratingModal.successTitle')}
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
            {t('client.ratingModal.successMessage')}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {t('client.ratingModal.successSubtext')}
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
      title={t('client.ratingModal.title')}
      centered
    >
      <Stack gap="md">
        {error && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            {error}
          </Alert>
        )}

        {booking && (
          <Stack gap="xs">
            <Text fw={500}>{translateService(booking.masterJobTitle)}</Text>
            <Text size="sm" c="dimmed">
              {t('client.ratingModal.withLabel', { name: booking.masterName })}
            </Text>
          </Stack>
        )}

        <Stack gap="xs" align="center" py="md">
          <Text size="sm" c="dimmed">{t('client.ratingModal.prompt')}</Text>
          <Rating
            value={rating}
            onChange={setRating}
            size="xl"
            emptySymbol={<Star size={32} />}
            fullSymbol={<Star size={32} fill="var(--mantine-color-yellow-5)" />}
          />
          <Text size="sm" c="dimmed">
            {t(`client.ratingModal.ratingLabels.${rating}` as const)}
          </Text>
        </Stack>

        <Textarea
          label={t('client.ratingModal.commentLabel')}
          placeholder={t('client.ratingModal.commentPlaceholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          minRows={3}
          maxRows={5}
          maxLength={1000}
        />

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
            onClick={handleSubmit}
            flex={1}
            disabled={isPending || rating === 0}
            leftSection={isPending ? <Loader size={16} /> : null}
          >
            {isPending ? t('client.ratingModal.submitting') : t('client.ratingModal.submit')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
