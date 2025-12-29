import React, { ChangeEvent, useState } from 'react';
import {
  ActionIcon, Input, Stack, TextInput,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';

import { PagedDataTableColumnFilter } from '../types';

interface TextInputFilterProps<T> extends PagedDataTableColumnFilter<T> {
  label: string;
  description: string;
  placeholder: string;
}

export default function TextInputFilter<T>({
  filterKey,
  initialValue,
  onChange,
  label,
  description,
  placeholder,
}: TextInputFilterProps<T>) {
  const [value, setValue] = useState(initialValue ?? '');

  const handleSearch = useDebouncedCallback((v: string) => {
    if (onChange) onChange(filterKey, v);
  }, 500);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    handleSearch(event.currentTarget.value);
  };

  const handleClearOnClick = () => {
    setValue('');
    if (onChange) onChange(filterKey, '');
  };

  return (
    <Stack gap="xs">
      <Input.Description>{description}</Input.Description>
      <TextInput
        label={label}
        placeholder={placeholder}
        rightSection={(
          <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={handleClearOnClick}>
            <IconX size={14} />
          </ActionIcon>
        )}
        value={value}
        onChange={handleOnChange}
      />
    </Stack>
  );
}
