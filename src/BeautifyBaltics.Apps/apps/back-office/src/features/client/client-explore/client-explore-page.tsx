import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Box, Container } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

import { useTranslateData } from '@/hooks/use-translate-data';
import type { FindMastersParams } from '@/state/endpoints/api.schemas';
import { useFindJobCategories, useFindJobs } from '@/state/endpoints/jobs';
import { useFindMasters } from '@/state/endpoints/masters';

import { ClientExploreHeader } from './client-explore-header';
import { ClientExploreResults } from './client-explore-results';

const PAGE_SIZE = 12;
const routeApi = getRouteApi('/top-masters/');

export function ClientExplorePage() {
  const navigate = useNavigate();
  const search = routeApi.useSearch();
  const searchRef = useRef(search);
  searchRef.current = search;

  const { translateCategory, translateService } = useTranslateData();

  const [searchInput, setSearchInput] = useState(search.search ?? '');
  const [locationInput, setLocationInput] = useState(search.location ?? '');
  const [debouncedSearch] = useDebouncedValue(searchInput, 300);
  const [debouncedLocation] = useDebouncedValue(locationInput, 300);

  const [priceRange, setPriceRange] = useState<[number, number]>([search.minPrice ?? 0, search.maxPrice ?? 500]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    navigate({
      search: {
        ...searchRef.current,
        search: debouncedSearch || undefined,
        location: debouncedLocation || undefined,
        page: undefined,
      } as never,
      replace: true,
    });
  }, [debouncedSearch, debouncedLocation, navigate]);

  const { data: jobCategories, isLoading: isLoadingCategories } = useFindJobCategories({ all: true });

  const { data: jobs, isLoading: isLoadingJobs } = useFindJobs(
    { categoryId: search.categoryId ?? undefined, all: true },
    { query: { enabled: true } },
  );

  const findMastersParams = useMemo<FindMastersParams>(() => {
    const params: FindMastersParams & { minPrice?: number; maxPrice?: number } = {
      page: search.page ?? 1,
      pageSize: PAGE_SIZE,
      sortBy: 'rating',
      ascending: false,
    };

    if (debouncedSearch) params.text = debouncedSearch;
    if (debouncedLocation) params.city = debouncedLocation;
    if (search.categoryId) params.jobCategoryId = search.categoryId;
    if (search.jobId) params.jobId = search.jobId;
    if (search.minPrice && search.minPrice > 0) params.minPrice = search.minPrice;
    if (search.maxPrice && search.maxPrice < 500) params.maxPrice = search.maxPrice;

    return params;
  }, [debouncedSearch, debouncedLocation, search.categoryId, search.jobId, search.page, search.minPrice, search.maxPrice]);

  const {
    data: mastersData,
    isLoading: isLoadingMasters,
    isError: isMastersError,
    refetch: refetchMasters,
  } = useFindMasters(findMastersParams, {
    query: { placeholderData: (previousData) => previousData },
  });

  const categoryOptions = useMemo(() => (
    jobCategories?.items
      ?.filter((cat): cat is typeof cat & { id: string; name: string } => !!cat.id && !!cat.name)
      .map((cat) => ({ value: cat.id, label: translateCategory(cat.name) })) ?? []
  ), [jobCategories?.items, translateCategory]);

  const jobOptions = useMemo(() => (
    jobs?.items
      ?.filter((job): job is typeof job & { id: string; name: string } => !!job.id && !!job.name)
      .map((job) => ({ value: job.id, label: translateService(job.name) })) ?? []
  ), [jobs?.items, translateService]);

  const handleSelectMaster = (masterId: string) => {
    navigate({ to: '/masters/$masterId', params: { masterId } });
  };

  const handleCategoryChange = (value: string | null) => {
    navigate({
      search: {
        ...search, categoryId: value ?? undefined, jobId: undefined, page: undefined,
      } as never,
      replace: true,
    });
  };

  const handleJobChange = (value: string | null) => {
    navigate({ search: { ...search, jobId: value ?? undefined, page: undefined } as never, replace: true });
  };

  const handlePageChange = (page: number) => {
    navigate({ search: { ...search, page } as never, replace: true });
  };

  const handlePriceRangeChangeEnd = (value: [number, number]) => {
    navigate({
      search: {
        ...search,
        minPrice: value[0] > 0 ? value[0] : undefined,
        maxPrice: value[1] < 500 ? value[1] : undefined,
        page: undefined,
      } as never,
      replace: true,
    });
  };

  const handleSearch = () => {
    navigate({ search: { ...search, page: undefined } as never, replace: true });
  };

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <ClientExploreHeader
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        locationValue={locationInput}
        onLocationChange={setLocationInput}
        selectedCategory={search.categoryId ?? null}
        onCategoryChange={handleCategoryChange}
        selectedJob={search.jobId ?? null}
        onJobChange={handleJobChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onPriceRangeChangeEnd={handlePriceRangeChangeEnd}
        categoryOptions={categoryOptions}
        jobOptions={jobOptions}
        isLoadingCategories={isLoadingCategories}
        isLoadingJobs={isLoadingJobs}
        onSearch={handleSearch}
      />

      <Container size="xl" py="xl">
        <ClientExploreResults
          masters={mastersData?.items}
          isLoading={isLoadingMasters}
          isError={isMastersError}
          onRetry={() => refetchMasters()}
          onSelectMaster={handleSelectMaster}
          totalResults={mastersData?.totalItemCount ?? 0}
          totalPages={mastersData?.pageCount ?? 1}
          currentPage={search.page ?? 1}
          onPageChange={handlePageChange}
          locationFilter={debouncedLocation}
        />
      </Container>
    </Box>
  );
}
