import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
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
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

import { MastersMap } from '@/features/map';
import useRoutedModal from '@/hooks/use-routed-modal';
import type { FindMastersParams } from '@/state/endpoints/api.schemas';
import { useFindJobCategories, useGetJobById } from '@/state/endpoints/jobs';
import { useFindMasters } from '@/state/endpoints/masters';

import { CategoryFilters } from './components/explore-category-filters';
import { FiltersDrawer } from './components/explore-filters-drawer';
import { ExploreHeader } from './components/explore-header';
import { MasterCard } from './components/explore-master-card';

const MAP_HEIGHT_DESKTOP = 600;
const MAP_HEIGHT_MOBILE = 280;
const routeApi = getRouteApi('/explore/');

export function ExplorePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const searchRef = useRef(search);
  searchRef.current = search;

  const { onOpen: openFilters, opened: filtersOpened, onClose: closeFilters } = useRoutedModal('explore-filters');

  const [searchInput, setSearchInput] = useState(search.search ?? '');
  const [debouncedSearch] = useDebouncedValue(searchInput, 300);

  const [priceRange, setPriceRange] = useState<[number, number]>([search.minPrice ?? 0, search.maxPrice ?? 200]);

  useEffect(() => {
    navigate({ search: { ...searchRef.current, search: debouncedSearch || undefined } as never, replace: true });
  }, [debouncedSearch, navigate]);

  const isMobile = useMediaQuery('(max-width: 62em)');
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);

  const { data: procedureJob } = useGetJobById(search.procedure ?? '', undefined, {
    query: { enabled: Boolean(search.procedure) },
  });

  useEffect(() => {
    if (!search.procedure || !procedureJob) return;
    navigate({ search: { ...searchRef.current, categoryId: procedureJob.categoryId ?? undefined } as never, replace: true });
    setSearchInput(procedureJob.name ?? '');
  }, [search.procedure, procedureJob, navigate]);

  const {
    data: jobCategories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useFindJobCategories({ all: true });

  const findMastersParams = useMemo<FindMastersParams>(() => {
    const params: FindMastersParams = { pageSize: 50 };
    if (debouncedSearch) params.text = debouncedSearch;
    if (search.categoryId) params.jobCategoryId = search.categoryId;
    return params;
  }, [debouncedSearch, search.categoryId]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFindMasters(findMastersParams, {
    query: { placeholderData: (previousData) => previousData },
  });

  const handleCategoryChange = (value: string | null) => {
    navigate({ search: { ...search, categoryId: value ?? undefined } as never, replace: true });
  };

  const handleSelectMaster = (masterId: string) => {
    setSelectedMaster(masterId);
    navigate({ to: '/masters/$masterId', params: { masterId: String(masterId) } });
  };

  const handlePriceChangeEnd = (value: [number, number]) => {
    navigate({
      search: {
        ...search,
        minPrice: value[0] > 0 ? value[0] : undefined,
        maxPrice: value[1] < 200 ? value[1] : undefined,
      } as never,
      replace: true,
    });
  };

  return (
    <Box bg="var(--mantine-color-body)">
      <ExploreHeader
        onOpenFilters={openFilters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <Container size="lg" py="xl">
        <CategoryFilters
          categories={jobCategories?.items ?? []}
          selected={search.categoryId ?? null}
          onSelect={handleCategoryChange}
        />
        {isLoadingCategories ? (
          <Text c="dimmed" size="sm" mb="md">
            {t('explore.page.loadingCategories')}
          </Text>
        ) : null}
        {isCategoriesError ? (
          <Alert
            icon={<AlertCircle size={16} />}
            title={t('explore.page.categoriesErrorTitle')}
            color="red"
            mb="md"
          >
            <Stack gap={4}>
              <Text>{t('explore.page.categoriesErrorMessage')}</Text>
              <Button variant="light" color="red" onClick={() => refetchCategories()}>
                {t('common.cta.tryAgain')}
              </Button>
            </Stack>
          </Alert>
        ) : null}

        {isMobile ? (
          <Stack gap="md">
            <MastersMap
              masters={data?.items ?? []}
              selectedMasterId={selectedMaster}
              onSelectMaster={handleSelectMaster}
              height={MAP_HEIGHT_MOBILE}
            />
            <Stack gap="md">
              {(isLoading && !data) ? (
                <Center mih={200}>
                  <Loader />
                </Center>
              ) : null}
              {isError ? (
                <Alert
                  icon={<AlertCircle size={16} />}
                  title={t('explore.page.mastersErrorTitle')}
                  color="red"
                >
                  <Stack gap={4}>
                    <Text>{t('explore.page.mastersErrorMessage')}</Text>
                    <Button variant="light" color="red" onClick={() => refetch()}>
                      {t('common.cta.tryAgain')}
                    </Button>
                  </Stack>
                </Alert>
              ) : null}
              {!isLoading && !isError && !data?.items?.length ? (
                <Stack align="center" gap={4} py="xl">
                  <Text fw={500}>{t('explore.page.emptyTitle')}</Text>
                  <Text c="dimmed">{t('explore.page.emptySubtitle')}</Text>
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
          </Stack>
        ) : (
          <Box
            display="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24,
            }}
          >
            <ScrollArea h={MAP_HEIGHT_DESKTOP} type="always" offsetScrollbars>
              <Stack gap="md" pr="sm">
                {(isLoading && !data) ? (
                  <Center mih={240}>
                    <Loader />
                  </Center>
                ) : null}

                {isError ? (
                  <Alert
                    icon={<AlertCircle size={16} />}
                    title={t('explore.page.mastersErrorTitle')}
                    color="red"
                  >
                    <Stack gap={4}>
                      <Text>{t('explore.page.mastersErrorMessage')}</Text>
                      <Button variant="light" color="red" onClick={() => refetch()}>
                        {t('common.cta.tryAgain')}
                      </Button>
                    </Stack>
                  </Alert>
                ) : null}

                {!isLoading && !isError && !data?.items?.length ? (
                  <Stack align="center" gap={4} py="xl">
                    <Text fw={500}>{t('explore.page.emptyTitle')}</Text>
                    <Text c="dimmed">{t('explore.page.emptySubtitle')}</Text>
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

            <MastersMap
              masters={data?.items ?? []}
              selectedMasterId={selectedMaster}
              onSelectMaster={handleSelectMaster}
              height={MAP_HEIGHT_DESKTOP}
            />
          </Box>
        )}
      </Container>

      <FiltersDrawer
        opened={filtersOpened}
        onClose={closeFilters}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        onPriceChangeEnd={handlePriceChangeEnd}
      />
    </Box>
  );
}
