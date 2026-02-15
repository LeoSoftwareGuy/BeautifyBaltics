import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const subtitle = locationFilter
    ? t('client.explore.results.subtitleWithLocation', { location: locationFilter })
    : t('client.explore.results.subtitle');

  return (
    <>
      <Group justify="space-between" align="flex-end" mb="lg">
        <div>
          <Title order={2}>{t('client.explore.results.title')}</Title>
          <Text c="dimmed">
            {subtitle}
          </Text>
        </div>
        <Text size="sm" c="dimmed">
          {t('client.explore.results.count', { count: totalResults })}
        </Text>
      </Group>

      {isLoading && !masters && (
        <Center mih={300}>
          <Loader size="lg" />
        </Center>
      )}

      {isError && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title={t('client.explore.results.errorTitle')}
          color="red"
        >
          <Stack gap="xs">
            <Text size="sm">{t('client.explore.results.errorMessage')}</Text>
            <Button variant="light" color="red" size="xs" onClick={onRetry}>
              {t('cta.tryAgain')}
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !isError && !masters?.length && (
        <Center mih={300}>
          <Stack align="center" gap="xs">
            <Text fw={500}>{t('client.explore.results.emptyTitle')}</Text>
            <Text c="dimmed" size="sm">{t('client.explore.results.emptySubtitle')}</Text>
          </Stack>
        </Center>
      )}

      {/* Masters Grid */}
      {masters && masters.length > 0 && (
        <>
          <Grid gutter="lg">
            {masters.map((master) => (
              <Grid.Col
                key={master.id}
                span={{
                  base: 12, sm: 6, md: 4, lg: 3,
                }}
              >
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
