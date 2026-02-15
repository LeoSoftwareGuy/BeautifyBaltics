import { useTranslation } from 'react-i18next';
import { Button, Group, ScrollArea } from '@mantine/core';

import type { FindJobCategoriesResponse } from '@/state/endpoints/api.schemas';

type CategoryFiltersProps = {
  categories: FindJobCategoriesResponse[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
};

function CategoryFilters({ categories, selected, onSelect }: CategoryFiltersProps) {
  const { t } = useTranslation();

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Group gap="sm" mb="lg" wrap="nowrap">
        <Button
          key="all"
          variant={selected === null ? 'filled' : 'default'}
          radius="xl"
          onClick={() => onSelect(null)}
        >
          {t('explore.categories.all')}
        </Button>
        {categories.map((category, index) => (
          <Button
            key={category.id ?? `category-${index}`}
            variant={category.id === selected ? 'filled' : 'default'}
            radius="xl"
            onClick={() => onSelect(category.id ?? null)}
          >
            {category.name ?? t('explore.categories.unnamed')}
          </Button>
        ))}
      </Group>
    </ScrollArea>
  );
}

export default CategoryFilters;
