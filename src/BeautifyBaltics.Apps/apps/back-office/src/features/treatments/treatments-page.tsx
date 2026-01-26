import { useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconSearch } from '@tabler/icons-react';

import type { FindJobCategoriesResponse } from '@/state/endpoints/api.schemas';
import { useFindJobCategories } from '@/state/endpoints/jobs';

import { TreatmentsDataTable } from './treatments-data-table';

export default function TreatmentsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useFindJobCategories({ all: true });

  const categories = categoriesData?.items ?? [];

  const renderCategories = () => (
    <Group gap="sm" mb="lg" wrap="wrap">
      <Badge
        variant={!selectedCategory ? 'filled' : 'light'}
        color="grape"
        component="button"
        type="button"
        onClick={() => setSelectedCategory(null)}
        style={{ cursor: 'pointer' }}
      >
        All
      </Badge>
      {categories.map((category: FindJobCategoriesResponse, index) => {
        const key = category.id ?? `${category.name ?? 'category'}-${index}`;
        return (
          <Badge
            key={key}
            variant={selectedCategory === category.id ? 'filled' : 'light'}
            color="grape"
            component="button"
            type="button"
            onClick={() => setSelectedCategory(category.id ?? null)}
            style={{ cursor: 'pointer' }}
          >
            {category.name ?? 'Uncategorized'}
          </Badge>
        );
      })}
    </Group>
  );

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={2}>Beauty Treatments</Title>
            <Text c="dimmed">Browse all services masters can perform.</Text>
          </Stack>

          <TextInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            placeholder="Search treatments"
            leftSection={<IconSearch size={16} />}
          />

          {isCategoriesLoading ? <Loader size="sm" /> : renderCategories()}

          {isCategoriesError ? (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              <Stack gap={4}>
                <Text>Unable to load categories.</Text>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  onClick={() => refetchCategories()}
                >
                  Try again
                </Button>
              </Stack>
            </Alert>
          ) : null}

          <TreatmentsDataTable search={searchValue} categoryId={selectedCategory} />
        </Stack>
      </Container>
    </Box>
  );
}
