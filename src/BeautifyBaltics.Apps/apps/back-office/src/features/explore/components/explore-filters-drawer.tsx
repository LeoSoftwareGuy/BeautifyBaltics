import { useTranslation } from 'react-i18next';
import {
  Drawer,
  Group,
  RangeSlider,
  Stack,
  Text,
} from '@mantine/core';
import { DollarSign } from 'lucide-react';

type FiltersDrawerProps = {
  opened: boolean;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  onClose: () => void;
};

function FiltersDrawer({
  opened,
  priceRange,
  onClose,
  onPriceChange,
}: FiltersDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={t('explore.filters.title')}
      padding="xl"
    >
      <Stack>
        <Text fw={600} size="sm" c="dimmed" mb="xs">
          {t('explore.filters.priceRange')}
        </Text>
        <RangeSlider
          value={priceRange}
          onChange={(value) => onPriceChange(value as [number, number])}
          min={0}
          max={200}
          step={5}
          label={(value) => `$${value}`}
          thumbChildren={<DollarSign size={14} />}
        />
        <Group justify="space-between" c="dimmed" gap="sm">
          <Text>
            $
            {priceRange[0]}
          </Text>
          <Text>
            $
            {priceRange[1]}
          </Text>
        </Group>
      </Stack>
    </Drawer>
  );
}

export default FiltersDrawer;
