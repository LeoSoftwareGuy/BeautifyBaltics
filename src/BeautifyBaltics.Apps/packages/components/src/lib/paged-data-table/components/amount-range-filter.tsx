import { useState } from 'react';
import {
  ActionIcon,
  Group,
  Input,
  NumberInput,
  Stack,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';

import { PagedDataTableColumnFilter } from '../types';

interface AmountRangeFilterProps<T> extends PagedDataTableColumnFilter<T> {
  initialValue?: [string | null, string | null];
  description: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export default function AmountRangeFilter<T>({
  initialValue,
  filterKey,
  onChange,
  description,
  minPlaceholder = 'Min amount',
  maxPlaceholder = 'Max amount',
}: AmountRangeFilterProps<T>) {
  const [minValue, setMinValue] = useState(initialValue?.[0] ?? '');
  const [maxValue, setMaxValue] = useState(initialValue?.[1] ?? '');

  const handleMinOnChange = (value: string | number) => {
    const stringValue = value === undefined || value === null ? '' : String(value);
    setMinValue(stringValue);
    updateFilter(stringValue, maxValue);
  };

  const handleMinOnClear = () => {
    setMinValue('');
    updateFilter('', maxValue);
  };

  const handleMaxOnChange = (value: string | number) => {
    const stringValue = value === undefined || value === null ? '' : String(value);
    setMaxValue(stringValue);
    updateFilter(minValue, stringValue);
  };

  const handleMaxOnClear = () => {
    setMaxValue('');
    updateFilter(minValue, '');
  };

  const updateFilter = useDebouncedCallback((min: string, max: string) => {
    if (onChange) {
      if (min === '' && max === '') {
        onChange(filterKey, null);
      } else {
        onChange(filterKey, [
          min !== '' ? min : null,
          max !== '' ? max : null,
        ]);
      }
    }
  }, 500);

  return (
    <Stack gap="xs">
      <Input.Description>{description}</Input.Description>
      <Group gap="xs">
        <NumberInput
          label="Min"
          placeholder={minPlaceholder}
          value={minValue}
          onChange={handleMinOnChange}
          hideControls
          style={{ flex: 1 }}
          decimalScale={2}
          thousandSeparator=" "
          rightSectionWidth={34}
          rightSection={(
            <ActionIcon size="sm" variant="transparent" c="gray" onClick={handleMinOnClear}>
              <IconX />
            </ActionIcon>
          )}
        />
        <NumberInput
          label="Max"
          placeholder={maxPlaceholder}
          value={maxValue}
          onChange={handleMaxOnChange}
          hideControls
          style={{ flex: 1 }}
          decimalScale={2}
          thousandSeparator=" "
          rightSectionWidth={34}
          rightSection={(
            <ActionIcon size="sm" variant="transparent" c="gray" onClick={handleMaxOnClear}>
              <IconX />
            </ActionIcon>
          )}
        />
      </Group>
    </Stack>
  );
}
