import { useState } from 'react';
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
          title: 'Rating submitted',
          message: 'Thank you for your feedback!',
          color: 'green',
        });
      },
      onError: (err: any) => {
        setError(err?.detail ?? 'Failed to submit rating. Please try again.');
        notifications.show({
          title: 'Rating failed',
          message: err?.detail ?? 'Failed to submit rating',
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
        title="Rating Submitted"
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
            Thank you for your feedback!
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Your rating helps other clients find great masters.
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
      title="Rate your experience"
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
            <Text fw={500}>{booking.masterJobTitle}</Text>
            <Text size="sm" c="dimmed">
              with
              {' '}
              {booking.masterName}
            </Text>
          </Stack>
        )}

        <Stack gap="xs" align="center" py="md">
          <Text size="sm" c="dimmed">How would you rate this service?</Text>
          <Rating
            value={rating}
            onChange={setRating}
            size="xl"
            emptySymbol={<Star size={32} />}
            fullSymbol={<Star size={32} fill="var(--mantine-color-yellow-5)" />}
          />
          <Text size="sm" c="dimmed">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        </Stack>

        <Textarea
          label="Comment (optional)"
          placeholder="Share your experience with this master..."
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
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            flex={1}
            disabled={isPending || rating === 0}
            leftSection={isPending ? <Loader size={16} /> : null}
          >
            {isPending ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
