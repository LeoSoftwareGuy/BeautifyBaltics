import {
  Box,
  Button,
  Container,
  Group,
  RangeSlider,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconMapPin, IconSearch } from '@tabler/icons-react';

interface SelectOption {
  value: string;
  label: string;
}

interface ClientExploreHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  locationValue: string;
  onLocationChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  selectedJob: string | null;
  onJobChange: (value: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  categoryOptions: SelectOption[];
  jobOptions: SelectOption[];
  isLoadingCategories: boolean;
  isLoadingJobs: boolean;
  onSearch: () => void;
}

export function ClientExploreHeader({
  searchValue,
  onSearchChange,
  locationValue,
  onLocationChange,
  selectedCategory,
  onCategoryChange,
  selectedJob,
  onJobChange,
  priceRange,
  onPriceRangeChange,
  categoryOptions,
  jobOptions,
  isLoadingCategories,
  isLoadingJobs,
  onSearch,
}: ClientExploreHeaderProps) {
  return (
    <Box
      component="header"
      bg="white"
      style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      py="lg"
      px="md"
    >
      <Container size="xl">
        <Stack gap="md">
          {/* Search Bar */}
          <Group gap="sm" align="flex-end">
            <TextInput
              flex={1}
              placeholder="Search services or keywords..."
              leftSection={<IconSearch size={18} />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
              size="md"
            />
            <TextInput
              w={200}
              placeholder="Location..."
              leftSection={<IconMapPin size={18} />}
              value={locationValue}
              onChange={(e) => onLocationChange(e.currentTarget.value)}
              size="md"
            />
            <Button size="md" onClick={onSearch}>
              Search
            </Button>
          </Group>

          {/* Filters Row */}
          <Group gap="md" align="flex-end" wrap="wrap">
            <Select
              label="Category"
              placeholder="All Categories"
              data={categoryOptions}
              value={selectedCategory}
              onChange={onCategoryChange}
              clearable
              searchable
              disabled={isLoadingCategories}
              w={200}
            />
            <Select
              label="Service"
              placeholder="All Services"
              data={jobOptions}
              value={selectedJob}
              onChange={onJobChange}
              clearable
              searchable
              disabled={isLoadingJobs || !selectedCategory}
              w={200}
            />
            <Box w={250}>
              <Text size="sm" fw={500} mb={4}>Price Range</Text>
              <Group gap="xs" align="center">
                <Text size="xs" c="dimmed">
                  €
                  {priceRange[0]}
                </Text>
                <RangeSlider
                  flex={1}
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange}
                  onChange={onPriceRangeChange}
                  size="sm"
                  marks={[
                    { value: 0, label: '' },
                    { value: 250, label: '' },
                    { value: 500, label: '' },
                  ]}
                />
                <Text size="xs" c="dimmed">
                  €
                  {priceRange[1]}
                </Text>
              </Group>
            </Box>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
