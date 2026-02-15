import { useTranslation } from 'react-i18next';
import {
  Card,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';
import { MapPin, Star } from 'lucide-react';

import type { FindMastersResponse } from '@/state/endpoints/api.schemas';

type MasterCardProps = {
  master: FindMastersResponse;
  selected: boolean;
  onSelect: (id: string) => void;
};

function MasterCard({ master, selected, onSelect }: MasterCardProps) {
  const { t } = useTranslation();
  const fullName = [master.firstName, master.lastName].filter(Boolean).join(' ').trim()
    || t('explore.masterCard.unnamed');
  const ratingValue = typeof master.rating === 'number' ? master.rating.toFixed(1) : null;
  const address = master.city ?? t('explore.masterCard.locationFallback');
  const handleSelect = () => {
    if (master.id) {
      onSelect(master.id);
    }
  };

  return (
    <Card
      padding="md"
      radius="lg"
      withBorder
      style={{
        cursor: 'pointer',
        boxShadow: selected ? '0 0 0 2px var(--mantine-color-grape-4)' : undefined,
        transition: 'box-shadow 150ms ease, transform 150ms ease',
      }}
      onMouseEnter={(event) => {
        const target = event.currentTarget;
        target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(event) => {
        const target = event.currentTarget;
        target.style.transform = 'none';
      }}
      onClick={handleSelect}
    >
      <Group gap="md" align="flex-start">
        <Image
          src={master.profileImageUrl}
          alt={fullName}
          radius="md"
          w={96}
          h={96}
          fit="cover"
          fallbackSrc="https://placehold.co/200x200?text=Master"
        />
        <Stack gap={4} flex={1}>
          <Group justify="space-between" align="center" gap="xs">
            <Text fw={600} truncate="end">
              {fullName}
            </Text>
          </Group>
          <Group gap="xs" c="dimmed" fz="sm">
            <Group gap={4}>
              <Star size={16} fill="currentColor" />
              <Text fw={600} c="var(--mantine-color-text)">
                {ratingValue ?? t('explore.masterCard.new')}
              </Text>
              <Text>{ratingValue ? t('explore.masterCard.ratingLabel') : t('explore.masterCard.awaitingReviews')}</Text>
            </Group>
          </Group>
          <Group gap={6} c="dimmed" fz="sm">
            <MapPin size={16} />
            <Text>{address}</Text>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

export default MasterCard;
