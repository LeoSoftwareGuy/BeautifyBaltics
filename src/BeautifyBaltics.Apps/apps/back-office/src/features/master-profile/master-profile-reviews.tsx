import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Card,
  Group,
  Rating,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Star } from 'lucide-react';

import { useGetMasterRatings } from '@/state/endpoints/ratings';
import datetime from '@/utils/datetime';

type MasterProfileReviewsProps = {
  masterId: string;
};

function MasterProfileReviews({ masterId }: MasterProfileReviewsProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetMasterRatings(
    masterId,
    { masterId, page: 1, pageSize: 10 },
    { query: { enabled: !!masterId } },
  );

  const reviews = data?.items ?? [];
  const totalCount = data?.totalItemCount ?? 0;

  if (isLoading) {
    return (
      <Card withBorder radius="lg" p="xl" mt="xl">
        <Stack gap="md">
          <Title order={3}>{t('masterProfile.reviews.title')}</Title>
          <Skeleton height={100} />
          <Skeleton height={100} />
        </Stack>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card withBorder radius="lg" p="xl" mt="xl">
        <Stack gap="md">
          <Title order={3}>{t('masterProfile.reviews.title')}</Title>
          <Text c="dimmed" ta="center" py="xl">
            {t('masterProfile.reviews.empty')}
          </Text>
        </Stack>
      </Card>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.value, 0) / reviews.length
    : 0;

  return (
    <Card withBorder radius="lg" p="xl" mt="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3}>{t('masterProfile.reviews.title')}</Title>
            <Text size="sm" c="dimmed">
              {t('masterProfile.reviews.review', { count: totalCount })}
            </Text>
          </div>
          <Group gap="xs">
            <Star size={20} fill="var(--mantine-color-yellow-5)" color="var(--mantine-color-yellow-5)" />
            <Text fw={600} size="lg">
              {averageRating.toFixed(1)}
            </Text>
          </Group>
        </Group>

        <Stack gap="md">
          {reviews.map((review) => (
            <Card key={review.id} withBorder radius="md" p="md">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" color="grape">
                      {review.clientName.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>{review.clientName}</Text>
                      <Text size="xs" c="dimmed">
                        {datetime.formatDate(review.submittedAt)}
                      </Text>
                    </div>
                  </Group>
                  <Rating value={review.value} readOnly size="sm" />
                </Group>
                {review.comment && (
                  <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                    {review.comment}
                  </Text>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default MasterProfileReviews;
