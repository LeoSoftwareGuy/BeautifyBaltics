import React, { useState } from 'react';
import { ActionIcon, Input, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconX } from '@tabler/icons-react';

import { PagedDataTableColumnFilter } from '../types';

interface DatePickerRangeFilterProps<T> extends PagedDataTableColumnFilter<T> {
  label: string;
  description: string;
  placeholder?: string;
  valueFormat?: string;
}

export default function DatePickerRangeFilter<T>({
  filterKey,
  initialValue,
  onChange,
  label,
  description,
  placeholder,
  valueFormat = 'DD.MM.YYYY',
}: DatePickerRangeFilterProps<T>) {
  const [rangeValue, setRangeValue] = useState<[string | null, string | null]>(() => {
    if (Array.isArray(initialValue) && initialValue.length === 2) {
      const [start, end] = initialValue;
      return [start, end];
    }
    return [null, null];
  });

  const handleChange = (dates: [string | null, string | null]) => {
    setRangeValue(dates);
    onChange?.(filterKey, dates);
  };

  const clearRange = () => {
    setRangeValue([null, null]);
    onChange?.(filterKey, null);
  };

  return (
    <Stack gap="xs">
      <Input.Description>{description}</Input.Description>

      <DatePickerInput
        type="range"
        label={label}
        placeholder={placeholder}
        value={rangeValue}
        onChange={handleChange}
        valueFormat={valueFormat}
        dropdownType="popover"
        clearable={false}
        defaultLevel="month"
        popoverProps={{
          withinPortal: false,
          shadow: 'md',
        }}
        monthsListFormat="MMM"
        yearsListFormat="YYYY"
        rightSection={
          (rangeValue[0] || rangeValue[1]) && (
            <ActionIcon
              size="sm"
              variant="transparent"
              color="dimmed"
              onClick={clearRange}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <IconX size={14} />
            </ActionIcon>
          )
        }
      />
    </Stack>
  );
}
