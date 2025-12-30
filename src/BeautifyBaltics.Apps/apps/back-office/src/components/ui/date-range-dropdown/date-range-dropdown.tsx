import { useEffect, useState } from 'react';
import { Button, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';

import datetime from '@/utils/datetime';

import { presets } from './date-range-presets';

interface DateRangeDropdownProps {
  date?: [string | null, string | null];
  onChange?: (date: [string | null, string | null]) => void;
}

export default function DateRangeDropdown({ date, onChange }: DateRangeDropdownProps) {
  const [value, setValue] = useState<[string | null, string | null]>(date ?? [null, null]);

  useEffect(() => {
    if (!value[0] || !value[1]) return;
    if (onChange) onChange(value);
  }, [onChange, value]);

  const handleDateRangeChange = (nextValue: [string | null, string | null]) => {
    setValue(nextValue);
  };

  const renderDateLabel = () => {
    if (!date) return 'Select date range';
    const match = presets.find((preset) => preset.value[0] === date[0] && preset.value[1] === date[1]);
    if (match) return match.label;
    return `${datetime.formatDate(date[0])} - ${datetime.formatDate(date[1])}`;
  };

  return (
    <Popover position="bottom-end">
      <Popover.Target>
        <Button
          leftSection={<IconCalendar size={16} />}
          size="xs"
          variant="default"
          rightSection={<IconChevronDown size={12} />}
        >
          {renderDateLabel()}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <DatePicker
          type="range"
          value={value}
          onChange={handleDateRangeChange}
          presets={presets}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
