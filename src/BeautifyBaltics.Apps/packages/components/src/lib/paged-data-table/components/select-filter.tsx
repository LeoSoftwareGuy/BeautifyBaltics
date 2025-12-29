import { useState } from 'react';
import { Select, SelectProps } from '@mantine/core';

import { PagedDataTableColumnFilter } from '../types';

type SelectFilterProps<T> = PagedDataTableColumnFilter<T> & Omit<SelectProps, keyof PagedDataTableColumnFilter<T>>;

export default function SelectFilter<T>({
  filterKey, initialValue, onChange, ...props
}: SelectFilterProps<T>) {
  const [value, setValue] = useState(initialValue);

  const handleOnClick = (selectedValue: string | null) => {
    setValue(selectedValue);
    if (onChange) onChange(filterKey, selectedValue);
  };

  return <Select value={value} {...props} onChange={handleOnClick} />;
}
