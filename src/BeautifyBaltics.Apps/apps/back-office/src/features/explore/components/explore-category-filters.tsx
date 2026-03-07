import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ScrollArea } from '@mantine/core';

import { useTranslateData } from '@/hooks/use-translate-data';
import type { FindJobCategoriesResponse } from '@/state/endpoints/api.schemas';

type CategoryFiltersProps = {
  categories: FindJobCategoriesResponse[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
};

const pillStyle = (active: boolean): React.CSSProperties => ({
  whiteSpace: 'nowrap',
  padding: '8px 20px',
  borderRadius: 9999,
  border: active ? 'none' : '1px solid #e2e8f0',
  background: active ? '#d8557a' : '#fff',
  color: active ? '#fff' : '#64748b',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  flexShrink: 0,
});

export function CategoryFilters({ categories, selected, onSelect }: CategoryFiltersProps) {
  const { t } = useTranslation();
  const { translateCategory } = useTranslateData();

  return (
    <ScrollArea type="never" mb="lg">
      <Box style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
        <button
          key="all"
          type="button"
          style={pillStyle(selected === null)}
          onClick={() => onSelect(null)}
        >
          {t('explore.categories.all')}
        </button>
        {categories.map((category, index) => (
          <button
            key={category.id ?? `category-${index}`}
            type="button"
            style={pillStyle(category.id === selected)}
            onClick={() => onSelect(category.id ?? null)}
          >
            {category.name ? translateCategory(category.name) : t('explore.categories.unnamed')}
          </button>
        ))}
      </Box>
    </ScrollArea>
  );
}
