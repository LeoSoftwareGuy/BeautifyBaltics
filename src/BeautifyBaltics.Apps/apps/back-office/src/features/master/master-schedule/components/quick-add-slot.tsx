import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconCalendar, IconCoffee, IconPlus } from '@tabler/icons-react';

import { AvailabilitySlotType } from '@/state/endpoints/api.schemas';

type QuickAddSlotProps = {
  selectedRange: [Date | null, Date | null];
  startTimeInput: string;
  endTimeInput: string;
  slotType: AvailabilitySlotType;
  isLoading: boolean;
  onRangeChange: (dates: [Date | null, Date | null]) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onSlotTypeChange: (type: AvailabilitySlotType) => void;
  onSave: () => void;
};

export function QuickAddSlot({
  selectedRange,
  startTimeInput,
  endTimeInput,
  slotType,
  isLoading,
  onRangeChange,
  onStartTimeChange,
  onEndTimeChange,
  onSlotTypeChange,
  onSave,
}: QuickAddSlotProps) {
  const { t } = useTranslation();
  const canSave = Boolean(selectedRange[0] && selectedRange[1] && startTimeInput && endTimeInput);
  const isBreak = slotType === AvailabilitySlotType.Break;

  return (
    <Card withBorder radius="md" p="md">
      <Group gap="xs" mb="md">
        <ThemeIcon size="sm" variant="light" color={isBreak ? 'gray' : 'brand'}>
          {isBreak ? <IconCoffee size={14} /> : <IconPlus size={14} />}
        </ThemeIcon>
        <Text fw={600}>{t('master.timeSlots.quickAdd.title')}</Text>
      </Group>

      <Stack gap="md">
        <div>
          <Text size="xs" fw={500} c="dimmed" mb={4}>
            {t('master.timeSlots.quickAdd.slotTypeLabel')}
          </Text>
          <SegmentedControl
            fullWidth
            value={slotType}
            onChange={(value) => onSlotTypeChange(value as AvailabilitySlotType)}
            data={[
              { label: t('master.timeSlots.quickAdd.availability'), value: AvailabilitySlotType.Available },
              { label: t('master.timeSlots.quickAdd.break'), value: AvailabilitySlotType.Break },
            ]}
          />
        </div>

        <div>
          <Text size="xs" fw={500} c="dimmed" mb={4}>
            {t('master.timeSlots.quickAdd.dateRangeLabel')}
          </Text>
          <DatePickerInput
            type="range"
            value={selectedRange}
            onChange={(value) => {
              const rangeValue = (value ?? [null, null]) as [Date | null, Date | null];
              onRangeChange(rangeValue);
            }}
            placeholder={t('master.timeSlots.quickAdd.dateRangePlaceholder')}
            minDate={new Date()}
            rightSection={<IconCalendar size={16} />}
            allowSingleDateInRange
          />
          <Text size="xs" c="dimmed" mt={4}>
            {t('master.timeSlots.quickAdd.dateRangeHint')}
          </Text>
        </div>

        <Group grow>
          <div>
            <Text size="xs" fw={500} c="dimmed" mb={4}>
              {t('master.timeSlots.quickAdd.startLabel')}
            </Text>
            <TimeInput
              value={startTimeInput}
              onChange={(e) => onStartTimeChange(e.currentTarget.value)}
            />
          </div>
          <div>
            <Text size="xs" fw={500} c="dimmed" mb={4}>
              {t('master.timeSlots.quickAdd.endLabel')}
            </Text>
            <TimeInput
              value={endTimeInput}
              onChange={(e) => onEndTimeChange(e.currentTarget.value)}
            />
          </div>
        </Group>

        <Button
          fullWidth
          color={isBreak ? 'gray' : 'brand'}
          onClick={onSave}
          loading={isLoading}
          disabled={!canSave}
        >
          {isBreak ? t('master.timeSlots.quickAdd.saveBreak') : t('master.timeSlots.quickAdd.saveAvailability')}
        </Button>
      </Stack>
    </Card>
  );
}
