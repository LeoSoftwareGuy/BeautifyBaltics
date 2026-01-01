import {
  Badge,
  Card,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';
import { MapPin, Star } from 'lucide-react';

import type { Master } from '../types';

type MasterCardProps = {
  master: Master;
  selected: boolean;
  onSelect: (id: number) => void;
};

function MasterCard({ master, selected, onSelect }: MasterCardProps) {
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
      onClick={() => onSelect(master.id)}
    >
      <Group gap="md" align="flex-start">
        <Image
          src={master.image}
          alt={master.name}
          radius="md"
          w={96}
          h={96}
          fit="cover"
          fallbackSrc="https://placehold.co/200x200?text=Master"
        />
        <Stack gap={4} flex={1}>
          <Group justify="space-between" align="center" gap="xs">
            <Text fw={600} truncate="end">
              {master.name}
            </Text>
            <Badge variant="light">{master.priceLabel}</Badge>
          </Group>
          <Group gap="xs" c="dimmed" fz="sm">
            <Group gap={4}>
              <Star size={16} fill="currentColor" />
              <Text fw={600} c="var(--mantine-color-text)">
                {master.rating.toFixed(1)}
              </Text>
              <Text>
                (
                {master.reviews}
                )
              </Text>
            </Group>
          </Group>
          <Group gap={6} c="dimmed" fz="sm">
            <MapPin size={16} />
            <Text>{master.address}</Text>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

export default MasterCard;
