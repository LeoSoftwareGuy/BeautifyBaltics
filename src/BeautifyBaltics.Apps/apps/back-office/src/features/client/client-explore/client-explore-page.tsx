import { useMemo, useState } from 'react';
import { Box, Container } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';

import { useTranslateData } from '@/hooks/use-translate-data';
import type { FindMastersParams } from '@/state/endpoints/api.schemas';
import { useFindJobCategories, useFindJobs } from '@/state/endpoints/jobs';
import { useFindMasters } from '@/state/endpoints/masters';

import { ClientExploreHeader } from './client-explore-header';
import { ClientExploreResults } from './client-explore-results';

const PAGE_SIZE = 12;

export function ClientExplorePage() {
  const navigate = useNavigate();
  const { translateCategory, translateService } = useTranslateData();

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);
  const [locationValue, setLocationValue] = useState('');
  const [debouncedLocation] = useDebouncedValue(locationValue, 300);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [currentPage, setCurrentPage] = useState(1);

  const [minPrice, maxPrice] = priceRange;

  const { data: jobCategories, isLoading: isLoadingCategories } = useFindJobCategories({ all: true });

  const { data: jobs, isLoading: isLoadingJobs } = useFindJobs(
    { categoryId: selectedCategory ?? undefined, all: true },
    { query: { enabled: true } },
  );

  const findMastersParams = useMemo<FindMastersParams>(() => {
    const params: FindMastersParams & { minPrice?: number; maxPrice?: number } = {
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortBy: 'rating',
      ascending: false,
    };

    if (debouncedSearch) {
      params.text = debouncedSearch;
    }

    if (debouncedLocation) {
      params.city = debouncedLocation;
    }

    if (selectedCategory) {
      params.jobCategoryId = selectedCategory;
    }

    if (minPrice > 0) {
      params.minPrice = minPrice;
    }

    if (maxPrice < 500) {
      params.maxPrice = maxPrice;
    }

    return params;
  }, [debouncedSearch, debouncedLocation, selectedCategory, currentPage, minPrice, maxPrice]);

  const {
    data: mastersData,
    isLoading: isLoadingMasters,
    isError: isMastersError,
    refetch: refetchMasters,
  } = useFindMasters(findMastersParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  });

  const categoryOptions = useMemo(() => (
    jobCategories?.items
      ?.filter((cat): cat is typeof cat & { id: string; name: string } => !!cat.id && !!cat.name)
      .map((cat) => ({
        value: cat.id,
        label: translateCategory(cat.name),
      })) ?? []
  ), [jobCategories?.items, translateCategory]);

  const jobOptions = useMemo(() => (
    jobs?.items
      ?.filter((job): job is typeof job & { id: string; name: string } => !!job.id && !!job.name)
      .map((job) => ({
        value: job.id,
        label: translateService(job.name),
      })) ?? []
  ), [jobs?.items, translateService]);

  const handleSelectMaster = (masterId: string) => {
    navigate({ to: '/masters/$masterId', params: { masterId } });
  };

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value);
    setSelectedJob(null);
    setCurrentPage(1);
  };

  const handleJobChange = (value: string | null) => {
    setSelectedJob(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <ClientExploreHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        locationValue={locationValue}
        onLocationChange={setLocationValue}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedJob={selectedJob}
        onJobChange={handleJobChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
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
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          locationFilter={debouncedLocation}
        />
      </Container>
    </Box>
  );
}
