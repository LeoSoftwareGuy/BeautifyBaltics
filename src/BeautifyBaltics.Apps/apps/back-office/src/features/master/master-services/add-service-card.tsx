import { useState } from 'react';
import {
  Card, Stack, Text, ThemeIcon,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type AddServiceCardProps = {
  onClick: () => void;
};

export function AddServiceCard({ onClick }: AddServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  return (
    <Card
      radius="lg"
      p={0}
      onClick={onClick}
      style={{
        minHeight: 220,
        cursor: 'pointer',
        border: `2px dashed ${isHovered ? 'var(--mantine-color-brand-5)' : 'var(--mantine-color-gray-4)'}`,
        backgroundColor: isHovered ? 'var(--mantine-color-gray-1)' : 'transparent',
        transition: 'background-color 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack
        align="center"
        justify="center"
        h="100%"
        gap="md"
        style={{ minHeight: 220 }}
      >
        <ThemeIcon
          size={56}
          radius="xl"
          variant="light"
          color="brand"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 150ms ease',
          }}
        >
          <IconPlus size={28} />
        </ThemeIcon>
        <Stack gap={4} align="center">
          <Text fw={600} c={isHovered ? 'brand.6' : 'dimmed'}>
            {t('master.services.cards.addServiceTitle')}
          </Text>
          <Text size="xs" c="dimmed" ta="center" px="lg">
            {t('master.services.cards.addServiceSubtitle')}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
