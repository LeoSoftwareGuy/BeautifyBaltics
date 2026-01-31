import {
  Box, Group, Text, UnstyledButton,
} from '@mantine/core';

type Category = {
  id: string;
  name: string;
};

type MasterServicesListFilterProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
};

export function MasterServicesListFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: MasterServicesListFilterProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <Box
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
      }}
    >
      <Group gap={0}>
        <UnstyledButton
          onClick={() => onCategoryChange(null)}
          py="sm"
          px="md"
          style={{
            borderBottom: selectedCategoryId === null
              ? '3px solid var(--mantine-color-brand-5)'
              : '3px solid transparent',
            marginBottom: -1,
          }}
        >
          <Text
            size="sm"
            fw={600}
            c={selectedCategoryId === null ? undefined : 'dimmed'}
          >
            All Services
          </Text>
        </UnstyledButton>
        {categories.map((category) => (
          <UnstyledButton
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            py="sm"
            px="md"
            style={{
              borderBottom: selectedCategoryId === category.id
                ? '3px solid var(--mantine-color-brand-5)'
                : '3px solid transparent',
              marginBottom: -1,
            }}
          >
            <Text
              size="sm"
              fw={600}
              c={selectedCategoryId === category.id ? undefined : 'dimmed'}
            >
              {category.name}
            </Text>
          </UnstyledButton>
        ))}
      </Group>
    </Box>
  );
}
