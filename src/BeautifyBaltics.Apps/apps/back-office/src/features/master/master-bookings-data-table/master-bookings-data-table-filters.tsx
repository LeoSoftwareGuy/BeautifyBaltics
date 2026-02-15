import { useTranslation } from 'react-i18next';
import {
  Group, Tabs, TextInput,
} from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { IconCalendar, IconSearch } from '@tabler/icons-react';

import { BookingStatus } from '@/state/endpoints/api.schemas';

const STATUS_TABS = [
  { value: 'all', labelKey: 'master.bookings.filters.tabs.all' },
  { value: BookingStatus.Requested, labelKey: 'master.bookings.filters.tabs.requested' },
  { value: BookingStatus.Confirmed, labelKey: 'master.bookings.filters.tabs.confirmed' },
  { value: BookingStatus.Completed, labelKey: 'master.bookings.filters.tabs.completed' },
  { value: BookingStatus.Cancelled, labelKey: 'master.bookings.filters.tabs.cancelled' },
];

interface BookingsFiltersProps {
  dateRange: DatesRangeValue;
  onDateRangeChange: (value: DatesRangeValue) => void;
  status: string;
  onStatusChange: (value: string | null) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function BookingsFilters({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  searchValue,
  onSearchChange,
}: BookingsFiltersProps) {
  const { t } = useTranslation();

  return (
    <>
      <Group gap="md" justify="space-between" wrap="nowrap">
        <TextInput
          placeholder={t('master.bookings.filters.searchPlaceholder')}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
          radius="md"
        />
        <Group gap="sm" wrap="nowrap">
          <DatePickerInput
            type="range"
            placeholder={t('master.bookings.filters.datePlaceholder')}
            value={dateRange}
            onChange={onDateRangeChange}
            clearable
            leftSection={<IconCalendar size={16} />}
            w={250}
            radius="md"
          />
        </Group>
      </Group>

      <Tabs
        value={status}
        onChange={onStatusChange}
        variant="default"
      >
        <Tabs.List>
          {STATUS_TABS.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {t(tab.labelKey)}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </>
  );
}
