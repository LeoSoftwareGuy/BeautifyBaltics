import {
  Alert,
  Button,
  Center,
  Grid,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import type { FindMastersResponse } from '@/state/endpoints/api.schemas';

import { ClientExploreMasterCard } from './client-explore-master-card';

interface ClientExploreResultsProps {
  masters: FindMastersResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelectMaster: (masterId: string) => void;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  locationFilter?: string;
}

export function ClientExploreResults({
  masters,
  isLoading,
  isError,
  onRetry,
  onSelectMaster,
  totalResults,
  totalPages,
  currentPage,
  onPageChange,
  locationFilter,
}: ClientExploreResultsProps) {
  return (
    <>
      {/* Results Header */}
      <Group justify="space-between" align="flex-end" mb="lg">
        <div>
          <Title order={2}>Top Rated Masters</Title>
          <Text c="dimmed">
            Discover expert professionals
            {locationFilter && ` near ${locationFilter}`}
          </Text>
        </div>
        <Text size="sm" c="dimmed">
          Showing
          {' '}
          <Text span c="brand" fw={600}>{totalResults}</Text>
          {' '}
          results
        </Text>
      </Group>

      {/* Loading State */}
      {isLoading && !masters && (
        <Center mih={300}>
          <Loader size="lg" />
        </Center>
      )}

      {/* Error State */}
      {isError && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Unable to load masters"
          color="red"
        >
          <Stack gap="xs">
            <Text size="sm">Something went wrong while fetching masters.</Text>
            <Button variant="light" color="red" size="xs" onClick={onRetry}>
              Try again
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !isError && !masters?.length && (
        <Center mih={300}>
          <Stack align="center" gap="xs">
            <Text fw={500}>No masters found</Text>
            <Text c="dimmed" size="sm">Adjust filters or try a different search.</Text>
          </Stack>
        </Center>
      )}

      {/* Masters Grid */}
      {masters && masters.length > 0 && (
        <>
          <Grid gutter="lg">
            {masters.map((master) => (
              <Grid.Col key={master.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <ClientExploreMasterCard
                  master={master}
                  onSelect={onSelectMaster}
                />
              </Grid.Col>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Center mt="xl">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={onPageChange}
                size="md"
              />
            </Center>
          )}
        </>
      )}
    </>
  );
}
