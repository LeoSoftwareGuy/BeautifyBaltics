import { Group, Select, Tabs } from '@mantine/core';

import type { BookingStatus } from '../data';

type FiltersBarProps = {
  filter: BookingStatus | 'all';
  sortBy: 'date' | 'price';
  onFilterChange: (value: BookingStatus | 'all') => void;
  onSortChange: (value: 'date' | 'price') => void;
};

function ClientFiltersBar({
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
}: FiltersBarProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" mt="xl">
      <Tabs
        value={filter}
        onChange={(value) => onFilterChange((value ?? 'all') as BookingStatus | 'all')}
        variant="pills"
      >
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="cancelled">Cancelled</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Select
        value={sortBy}
        onChange={(value) => onSortChange((value ?? 'date') as 'date' | 'price')}
        data={[
          { value: 'date', label: 'Sort by date' },
          { value: 'price', label: 'Sort by price' },
        ]}
        maw={200}
        placeholder="Sort by"
      />
    </Group>
  );
}

export default ClientFiltersBar;
