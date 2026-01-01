import { Button, Group, ScrollArea } from '@mantine/core';

import type { MasterCategory } from '../types';

type CategoryFiltersProps = {
  categories: Array<{ id: MasterCategory; label: string }>;
  selected: MasterCategory;
  onSelect: (category: MasterCategory) => void;
};

function CategoryFilters({ categories, selected, onSelect }: CategoryFiltersProps) {
  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Group gap="sm" mb="lg" wrap="nowrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={category.id === selected ? 'filled' : 'default'}
            radius="xl"
            onClick={() => onSelect(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </Group>
    </ScrollArea>
  );
}

export default CategoryFilters;
