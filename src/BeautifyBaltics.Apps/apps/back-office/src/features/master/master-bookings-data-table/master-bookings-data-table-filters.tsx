import { Group, Select } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';

import { BookingStatus } from '@/state/endpoints/api.schemas';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: BookingStatus.Requested, label: 'Requested' },
  { value: BookingStatus.Confirmed, label: 'Confirmed' },
  { value: BookingStatus.Completed, label: 'Completed' },
  { value: BookingStatus.Cancelled, label: 'Cancelled' },
];

interface BookingsFiltersProps {
  dateRange: DatesRangeValue;
  onDateRangeChange: (value: DatesRangeValue) => void;
  status: string;
  onStatusChange: (value: string | null) => void;
}

export function BookingsFilters({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
}: BookingsFiltersProps) {
  return (
    <Group gap="md">
      <DatePickerInput
        type="range"
        label="Filter by date"
        placeholder="Select date range"
        value={dateRange}
        onChange={onDateRangeChange}
        clearable
        style={{ flex: 1, maxWidth: 300 }}
      />
      <Select
        label="Status"
        placeholder="Filter by status"
        data={STATUS_OPTIONS}
        value={status}
        onChange={onStatusChange}
        clearable
        style={{ width: 180 }}
      />
    </Group>
  );
}
