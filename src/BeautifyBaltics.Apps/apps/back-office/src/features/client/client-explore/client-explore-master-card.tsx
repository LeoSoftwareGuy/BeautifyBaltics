import {
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';
import { IconMapPin, IconStar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { FindMastersResponse } from '@/state/endpoints/api.schemas';

interface ClientExploreMasterCardProps {
  master: FindMastersResponse;
  onSelect: (masterId: string) => void;
}

export function ClientExploreMasterCard({ master, onSelect }: ClientExploreMasterCardProps) {
  const { t } = useTranslation();
  const fullName = [master.firstName, master.lastName].filter(Boolean).join(' ').trim()
    || t('explore.masterCard.unnamed');
  const ratingValue = typeof master.rating === 'number' ? master.rating.toFixed(1) : null;
  const location = master.city ?? t('explore.masterCard.locationFallback');

  const handleClick = () => {
    if (master.id) {
      onSelect(master.id);
    }
  };

  return (
    <Card
      radius="lg"
      withBorder
      p={0}
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
      onClick={handleClick}
    >
      {/* Image Section */}
      <Box pos="relative" h={180}>
        <Image
          src={master.profileImageUrl}
          alt={fullName}
          h="100%"
          w="100%"
          fit="cover"
          style={{ objectPosition: 'center top' }}
          fallbackSrc="https://placehold.co/400x300/e9ecef/868e96?text=Master"
        />
        {/* Rating Badge */}
        {ratingValue && (
          <Box
            pos="absolute"
            top={12}
            right={12}
            bg="rgba(255, 255, 255, 0.95)"
            px="xs"
            py={4}
            style={{
              borderRadius: 'var(--mantine-radius-md)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Group gap={4}>
              <IconStar size={14} fill="var(--mantine-color-yellow-5)" color="var(--mantine-color-yellow-5)" />
              <Text size="xs" fw={700}>{ratingValue}</Text>
            </Group>
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Stack gap="sm" p="md">
        <div>
          <Text fw={700} size="lg" lineClamp={1}>
            {fullName}
          </Text>
          {master.description && (
            <Text size="sm" c="dimmed" lineClamp={2} mt={4}>
              {master.description}
            </Text>
          )}
        </div>

        <Group gap="xs" c="dimmed">
          <IconMapPin size={16} />
          <Text size="sm">{location}</Text>
        </Group>

        <Button
          variant="default"
          fullWidth
          mt="xs"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          styles={{
            root: {
              transition: 'all 200ms ease',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-brand-6)',
                color: 'white',
                borderColor: 'var(--mantine-color-brand-6)',
              },
            },
          }}
        >
          {t('client.explore.card.viewProfile')}
        </Button>
      </Stack>
    </Card>
  );
}
