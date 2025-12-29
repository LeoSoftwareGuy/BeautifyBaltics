import { ChangeEvent, useState } from 'react';
import { Checkbox } from '@mantine/core';

import { PagedDataTableColumnFilter } from '../types';

export default function CheckboxFilter<T>({
  filterKey,
  initialValue,
  onChange,
}: PagedDataTableColumnFilter<T>) {
  const [value, setValue] = useState(initialValue ?? false);

  const handleOnClick = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.checked);
    if (onChange) onChange(filterKey, event.currentTarget.checked);
  };

  return <Checkbox checked={value} onChange={handleOnClick} />;
}
