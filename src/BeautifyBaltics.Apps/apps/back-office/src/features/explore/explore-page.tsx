import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Loader,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

import type { FindMastersParams } from '@/state/endpoints/api.schemas';
import { useFindJobCategories } from '@/state/endpoints/jobs';
import { useFindMasters } from '@/state/endpoints/masters';

import CategoryFilters from './components/explore-category-filters';
import FiltersDrawer from './components/explore-filters-drawer';
import ExploreHeader from './components/explore-header';
import MapPlaceholder from './components/explore-map-placeholder';
import MasterCard from './components/explore-master-card';

const MAP_HEIGHT = 600;

function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const {
    data: jobCategories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useFindJobCategories({ all: true });

  const findMastersParams = useMemo<FindMastersParams>(() => {
    const params: FindMastersParams = {
      pageSize: 50,
    };

    if (debouncedSearch) {
      params.text = debouncedSearch;
    }

    if (selectedCategory) {
      params.jobCategoryId = selectedCategory;
    }

    return params;
  }, [debouncedSearch, selectedCategory]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFindMasters(findMastersParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  });

  const handleSelectMaster = (masterId: string) => {
    setSelectedMaster(masterId);
    navigate({ to: '/master/$masterId', params: { masterId: String(masterId) } });
  };

  return (
    <Box bg="var(--mantine-color-body)">
      <ExploreHeader
        onOpenFilters={() => setDrawerOpen(true)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <Container size="lg" py="xl">
        <CategoryFilters
          categories={jobCategories?.items ?? []}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {isLoadingCategories ? (
          <Text c="dimmed" size="sm" mb="md">
            Loading categories...
          </Text>
        ) : null}
        {isCategoriesError ? (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Unable to load categories"
            color="red"
            mb="md"
          >
            <Stack gap={4}>
              <Text>Something went wrong while fetching job categories.</Text>
              <Button variant="light" color="red" onClick={() => refetchCategories()}>
                Try again
              </Button>
            </Stack>
          </Alert>
        ) : null}

        <Box
          display="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          <ScrollArea h={MAP_HEIGHT} type="always" offsetScrollbars>
            <Stack gap="md" pr="sm">
              {(isLoading && !data) ? (
                <Center mih={240}>
                  <Loader />
                </Center>
              ) : null}

              {isError ? (
                <Alert
                  icon={<AlertCircle size={16} />}
                  title="Unable to load masters"
                  color="red"
                >
                  <Stack gap={4}>
                    <Text>Something went wrong while fetching masters.</Text>
                    <Button variant="light" color="red" onClick={() => refetch()}>
                      Try again
                    </Button>
                  </Stack>
                </Alert>
              ) : null}

              {!isLoading && !isError && !data?.items?.length ? (
                <Stack align="center" gap={4} py="xl">
                  <Text fw={500}>No masters found</Text>
                  <Text c="dimmed">Adjust filters or try a different search.</Text>
                </Stack>
              ) : null}

              {data?.items?.map((master, index) => (
                <MasterCard
                  key={master.id ?? `master-${index}`}
                  master={master}
                  selected={selectedMaster === master.id}
                  onSelect={handleSelectMaster}
                />
              ))}
            </Stack>
          </ScrollArea>

          <MapPlaceholder height={MAP_HEIGHT} />
        </Box>
      </Container>

      <FiltersDrawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
      />
    </Box>
  );
}

export default ExplorePage;
