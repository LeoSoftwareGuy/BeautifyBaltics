import { useState } from 'react';
import { MultiSelect, MultiSelectProps } from '@mantine/core';

import { PagedDataTableColumnFilter } from '../types';

type MultiSelectFilterProps<T> = PagedDataTableColumnFilter<T> &
Omit<MultiSelectProps, keyof PagedDataTableColumnFilter<T>>;

export default function MultiSelectFilter<T>({
  filterKey, initialValue, onChange, ...props
}: MultiSelectFilterProps<T>) {
  const [value, setValue] = useState(initialValue || []);

  const handleOnClick = (selectedValues: string[]) => {
    setValue(selectedValues);
    if (onChange) onChange(filterKey, selectedValues);
  };

  return <MultiSelect value={value} onChange={handleOnClick} {...props} clearable />;
}
