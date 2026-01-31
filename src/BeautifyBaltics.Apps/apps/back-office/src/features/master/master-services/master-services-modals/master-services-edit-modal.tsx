import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

import type { MasterJobDTO } from '@/state/endpoints/api.schemas';
import { useFindJobCategories, useFindJobs } from '@/state/endpoints/jobs';
import { getFindMasterJobsQueryKey, useUpdateMasterJob } from '@/state/endpoints/masters';

type MasterServicesEditModalProps = {
  opened: boolean;
  onClose: () => void;
  masterId: string;
  service: MasterJobDTO | null;
};

export function MasterServicesEditModal({
  opened,
  onClose,
  masterId,
  service,
}: MasterServicesEditModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');

  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFindJobCategories({
    pageSize: 100,
  });
  const categories = categoriesData?.items ?? [];

  const { data: jobsData, isLoading: isJobsLoading } = useFindJobs(
    { categoryId: selectedCategoryId ?? undefined, pageSize: 100 },
    { query: { enabled: !!selectedCategoryId } },
  );
  const jobs = jobsData?.items ?? [];

  const { mutateAsync: updateJob, isPending: isUpdating } = useUpdateMasterJob({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: 'Service updated',
          message: 'Your service has been updated successfully.',
          color: 'green',
        });
        onClose();
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to update service',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  useEffect(() => {
    if (service) {
      setSelectedCategoryId(service.jobCategoryId ?? null);
      setSelectedJobId(service.jobId);
      setTitle(service.title ?? service.jobName ?? '');
      setPrice(service.price ?? '');
      setDuration(service.durationMinutes ?? '');
    }
  }, [service]);

  const canSubmit = !!selectedJobId && !!title.trim() && price !== '' && duration !== '';

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedJobId(null);
    setTitle('');
    setDuration('');
  };

  const handleJobChange = (jobId: string | null) => {
    setSelectedJobId(jobId);
    if (jobId) {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        setTitle(job.name);
        setDuration(job.durationMinutes);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit || !selectedJobId || !service?.id) {
      return;
    }
    await updateJob({
      id: masterId,
      jobId: service.id,
      data: {
        masterId,
        masterJobId: service.id,
        job: {
          jobId: selectedJobId,
          title: title.trim(),
          price: typeof price === 'number' ? price : parseFloat(String(price)),
          durationMinutes: typeof duration === 'number' ? duration : parseInt(String(duration), 10),
        },
      },
    });
  };

  const handlePriceChange = (value: string | number) => {
    setPrice(value === '' ? '' : Number(value));
  };

  const handleDurationChange = (value: string | number) => {
    setDuration(value === '' ? '' : Number(value));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Service"
      size="md"
      centered
    >
      <Stack gap="md">
        <Text c="dimmed" size="sm">
          Update the service details below
        </Text>

        {/* Category Select */}
        {isCategoriesLoading ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <Select
            label="Category"
            placeholder="Select category"
            searchable
            data={categories
              .filter((cat): cat is typeof cat & { id: string; name: string } => Boolean(cat.id && cat.name))
              .map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          />
        )}

        {/* Service Select (filtered by category) */}
        {isJobsLoading && selectedCategoryId ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <Select
            label="Service"
            placeholder={selectedCategoryId ? 'Select service' : 'Select category first'}
            searchable
            disabled={!selectedCategoryId}
            data={jobs.map((job) => ({
              value: job.id,
              label: job.name,
            }))}
            value={selectedJobId}
            onChange={handleJobChange}
          />
        )}

        <TextInput
          label="Service Title"
          placeholder="e.g., Classic Haircut"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <NumberInput
          label="Price (€)"
          placeholder="50"
          min={0}
          decimalScale={2}
          value={price}
          onChange={handlePriceChange}
        />
        <NumberInput
          label="Duration (min)"
          placeholder="30"
          min={5}
          step={5}
          value={duration}
          onChange={handleDurationChange}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="brand"
            disabled={!canSubmit}
            loading={isUpdating}
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
