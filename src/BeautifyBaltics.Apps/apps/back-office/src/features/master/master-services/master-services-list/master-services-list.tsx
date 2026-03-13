import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  getFindMasterJobsQueryKey,
  useDeleteMasterJob,
  useFindMasterJobs,
  useGetMasterById,
} from '@/state/endpoints/masters';
import {
  MasterProfilePreviewNotification,
  ProfilePreviewMode,
} from '../../master-profile-settings/master-profile-preview-notification';

import { AddServiceCard } from '../add-service-card';
import { MasterServiceCard } from '../master-service-card';
import { MasterServicesDetailModal } from '../master-services-modals';

import { MasterServicesListFilter } from './master-services-list-filter';

type MasterServicesListProps = {
  masterId: string;
};

const proposalParams = { proposal: true };

export function MasterServicesList({ masterId }: MasterServicesListProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState<ProfilePreviewMode>('proposed');
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const { data: masterData } = useGetMasterById(masterId, { id: masterId }, {
    query: { enabled: !!masterId },
  });
  const hasPendingChangesets = masterData?.hasPendingChangesets ?? false;

  const {
    data: approvedData,
    isLoading,
    isError,
    refetch: refetchApproved,
  } = useFindMasterJobs(masterId, undefined, {
    query: { enabled: !!masterId },
  });

  const { data: proposalData } = useFindMasterJobs(masterId, proposalParams, {
    query: { enabled: !!masterId && hasPendingChangesets },
  });

  const activeData = hasPendingChangesets && previewMode === 'proposed' && proposalData
    ? proposalData
    : approvedData;

  const allServices = useMemo(() => activeData?.jobs ?? [], [activeData?.jobs]);

  const availableCategories = useMemo(() => {
    const categoryMap = new Map<string, string>();
    allServices.forEach((service) => {
      if (service.jobCategoryId && service.jobCategoryName) {
        categoryMap.set(service.jobCategoryId, service.jobCategoryName);
      }
    });
    return Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }));
  }, [allServices]);

  const services = useMemo(() => {
    if (!selectedCategoryFilter) return allServices;
    return allServices.filter((s) => s.jobCategoryId === selectedCategoryFilter);
  }, [allServices, selectedCategoryFilter]);

  const selectedJob = allServices.find((job) => job.id === selectedJobId) ?? null;

  const { mutateAsync: deleteJob, isPending: isDeleting } = useDeleteMasterJob({
    mutation: {
      onSuccess: async () => {
        await refetchApproved();
        queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId, proposalParams) });
        notifications.show({
          title: t('master.services.notifications.deleteSuccessTitle'),
          message: t('master.services.notifications.deleteSuccessMessage'),
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: t('master.services.notifications.deleteErrorTitle'),
          message: error.detail ?? t('master.services.notifications.deleteErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleDelete = async (jobId: string) => {
    if (selectedJobId === jobId) setSelectedJobId(null);
    await deleteJob({ id: masterId, jobId });
  };

  const handleOpenDetailModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setDetailModalOpened(true);
  };

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="md" />
        <Text c="dimmed" size="sm">{t('master.services.loadingServices')}</Text>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={t('master.services.error.title')} color="red">
        {t('master.services.error.message')}
      </Alert>
    );
  }

  return (
    <>
      <Stack gap="lg">
        <div>
          <Title order={3}>{t('master.services.summary.title')}</Title>
          <Text c="dimmed" size="sm">
            {t('master.services.summary.count', { count: allServices.length })}
          </Text>
        </div>

        <MasterServicesListFilter
          categories={availableCategories}
          selectedCategoryId={selectedCategoryFilter}
          onCategoryChange={setSelectedCategoryFilter}
        />

        <SimpleGrid
          cols={{
            base: 1, sm: 2, lg: 3, xl: 4,
          }}
          spacing="lg"
        >
          {services.map((service) => (
            <MasterServiceCard
              key={service.id}
              masterId={masterId}
              service={service}
              onClick={handleOpenDetailModal}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
          <AddServiceCard masterId={masterId} />
        </SimpleGrid>
      </Stack>

      <MasterServicesDetailModal
        opened={detailModalOpened}
        onClose={() => setDetailModalOpened(false)}
        masterId={masterId}
        service={selectedJob}
      />

      {hasPendingChangesets && (
        <MasterProfilePreviewNotification
          mode={previewMode}
          onChange={setPreviewMode}
        />
      )}
    </>
  );
}
