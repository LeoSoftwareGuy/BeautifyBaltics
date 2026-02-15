import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';

import {
  useDeleteMasterJob,
  useFindMasterJobs,
  useUploadMasterJobImage,
} from '@/state/endpoints/masters';

import { AddServiceCard } from '../add-service-card';
import { MasterServiceCard } from '../master-service-card';
import { MasterServicesForm } from '../master-services-form';
import {
  MasterServicesDetailModal, MasterServicesEditModal, MasterServicesUploadModal,
} from '../master-services-modals';

import { MasterServicesListFilter } from './master-services-list-filter';

type MasterServicesListProps = {
  masterId: string;
};

export function MasterServicesList({ masterId }: MasterServicesListProps) {
  const { t } = useTranslation();
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const {
    data: jobsData,
    isLoading,
    isError,
    refetch,
  } = useFindMasterJobs(masterId, {
    query: { enabled: !!masterId },
  });

  const allServices = useMemo(() => jobsData?.jobs ?? [], [jobsData?.jobs]);

  // Get unique categories from the master's services
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
        await refetch();
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

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadMasterJobImage({
    mutation: {
      onSuccess: async () => {
        await refetch();
        notifications.show({
          title: t('master.services.notifications.uploadSuccessTitle'),
          message: t('master.services.notifications.uploadSuccessMessage'),
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: t('master.services.notifications.uploadErrorTitle'),
          message: error.detail ?? t('master.services.notifications.uploadErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleDelete = async (jobId: string) => {
    if (selectedJobId === jobId) {
      setSelectedJobId(null);
      setUploadModalOpened(false);
    }
    await deleteJob({ id: masterId, jobId });
  };

  const handleOpenUploadModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setUploadModalOpened(true);
  };

  const handleOpenEditModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setEditModalOpened(true);
  };

  const handleOpenDetailModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setDetailModalOpened(true);
  };

  const handleImageUpload = async (files: File[] | null) => {
    if (!selectedJobId || !files || files.length === 0) return;

    await uploadImage({
      masterId,
      jobId: selectedJobId,
      data: {
        masterId,
        masterJobId: selectedJobId,
        files,
      },
    });
  };

  const handleServiceAdded = () => {
    setAddModalOpened(false);
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
              service={service}
              onClick={handleOpenDetailModal}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              onUploadImage={handleOpenUploadModal}
              isDeleting={isDeleting}
            />
          ))}
          <AddServiceCard onClick={() => setAddModalOpened(true)} />
        </SimpleGrid>
      </Stack>

      {/* Add Service Modal */}
      <Modal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        title={t('master.services.modals.addTitle')}
        size="lg"
        centered
      >
        <MasterServicesForm masterId={masterId} onSuccess={handleServiceAdded} />
      </Modal>

      {/* Upload Images Modal */}
      <MasterServicesUploadModal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        masterId={masterId}
        service={selectedJob}
        onUpload={handleImageUpload}
        isUploading={isUploading}
      />

      {/* Edit Service Modal */}
      <MasterServicesEditModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        masterId={masterId}
        service={selectedJob}
      />

      {/* Service Detail Modal */}
      <MasterServicesDetailModal
        opened={detailModalOpened}
        onClose={() => setDetailModalOpened(false)}
        masterId={masterId}
        service={selectedJob}
        onEdit={handleOpenEditModal}
        onUploadImage={handleOpenUploadModal}
        onRefetch={refetch}
      />
    </>
  );
}
