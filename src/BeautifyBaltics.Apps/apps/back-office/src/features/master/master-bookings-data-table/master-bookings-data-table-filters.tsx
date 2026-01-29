import {
  Group, Tabs, TextInput,
} from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { IconCalendar, IconSearch } from '@tabler/icons-react';

import { BookingStatus } from '@/state/endpoints/api.schemas';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: BookingStatus.Requested, label: 'Pending' },
  { value: BookingStatus.Confirmed, label: 'Confirmed' },
  { value: BookingStatus.Completed, label: 'Completed' },
  { value: BookingStatus.Cancelled, label: 'Cancelled' },
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
  return (
    <>
      <Group gap="md" justify="space-between" wrap="nowrap">
        <TextInput
          placeholder="Search by client name or job..."
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
          radius="md"
        />
        <Group gap="sm" wrap="nowrap">
          <DatePickerInput
            type="range"
            placeholder="Select date range"
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
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </>
  );
}
