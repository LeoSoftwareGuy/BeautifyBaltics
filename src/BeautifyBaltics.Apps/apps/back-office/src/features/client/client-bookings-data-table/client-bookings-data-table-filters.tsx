import { useTranslation } from 'react-i18next';
import { Group, Select } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';

import { BookingStatus } from '@/state/endpoints/api.schemas';

interface ClientBookingsFiltersProps {
  dateRange: DatesRangeValue;
  onDateRangeChange: (value: DatesRangeValue) => void;
  status: string;
  onStatusChange: (value: string | null) => void;
}

export function ClientBookingsDataTableFilters({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
}: ClientBookingsFiltersProps) {
  const { t } = useTranslation();
  const statusOptions = [
    { value: '', label: t('client.bookings.filters.allStatuses') },
    { value: BookingStatus.Requested, label: t('client.bookings.status.requested') },
    { value: BookingStatus.Confirmed, label: t('client.bookings.status.confirmed') },
    { value: BookingStatus.Completed, label: t('client.bookings.status.completed') },
    { value: BookingStatus.Cancelled, label: t('client.bookings.status.cancelled') },
  ];

  return (
    <Group gap="md">
      <DatePickerInput
        type="range"
        label={t('client.bookings.filters.dateLabel')}
        placeholder={t('client.bookings.filters.datePlaceholder')}
        value={dateRange}
        onChange={onDateRangeChange}
        clearable
        style={{ flex: 1, maxWidth: 300 }}
      />
      <Select
        label={t('client.bookings.filters.statusLabel')}
        placeholder={t('client.bookings.filters.statusPlaceholder')}
        data={statusOptions}
        value={status}
        onChange={onStatusChange}
        clearable
        style={{ width: 180 }}
      />
    </Group>
  );
}
