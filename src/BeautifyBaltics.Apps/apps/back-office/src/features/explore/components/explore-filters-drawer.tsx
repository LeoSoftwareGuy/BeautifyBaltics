import { useTranslation } from 'react-i18next';
import {
  Drawer,
  Group,
  RangeSlider,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput, DateValue, TimeInput } from '@mantine/dates';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import { Euro } from 'lucide-react';

type FiltersDrawerProps = {
  opened: boolean;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  onPriceChangeEnd: (value: [number, number]) => void;
  onClose: () => void;
  selectedDate: DateValue;
  onDateChange: (value: DateValue) => void;
  selectedTime: string;
  onTimeChange: (value: string) => void;
};

export function FiltersDrawer({
  opened,
  priceRange,
  onClose,
  onPriceChange,
  onPriceChangeEnd,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
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
          {t('explore.filters.availability')}
        </Text>
        <DatePickerInput
          label={t('explore.filters.dateLabel')}
          placeholder={t('explore.filters.datePlaceholder')}
          leftSection={<IconCalendar size={16} style={{ marginTop: 16 }} />}
          value={selectedDate}
          onChange={onDateChange}
          clearable
          minDate={new Date()}
        />
        <TimeInput
          label={t('explore.filters.timeLabel')}
          placeholder={t('explore.filters.timePlaceholder')}
          leftSection={<IconClock size={16} style={{ marginTop: 16 }} />}
          value={selectedTime}
          onChange={(e) => onTimeChange(e.currentTarget.value)}
          disabled={!selectedDate}
        />
        <Text fw={600} size="sm" c="dimmed" mb="xs" mt="md">
          {t('explore.filters.priceRange')}
        </Text>
        <RangeSlider
          value={priceRange}
          onChange={(value) => onPriceChange(value as [number, number])}
          onChangeEnd={(value) => onPriceChangeEnd(value as [number, number])}
          min={0}
          max={200}
          step={5}
          label={(value) => `$${value}`}
          thumbChildren={<Euro size={14} />}
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
