import { useState } from 'react';
import {
  Button,
  NumberInput,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { useFindJobCategories, useFindJobs } from '@/state/endpoints/jobs';
import { getFindMasterJobsQueryKey, useCreateMasterJob } from '@/state/endpoints/masters';

type MasterServicesFormProps = {
  masterId: string;
  onSuccess?: () => void;
};

export function MasterServicesForm({ masterId, onSuccess }: MasterServicesFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');

  const queryClient = useQueryClient();

  // Fetch all categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useFindJobCategories({
    pageSize: 100,
  });
  const categories = categoriesData?.items ?? [];

  // Fetch jobs filtered by selected category
  const { data: jobsData, isLoading: isJobsLoading } = useFindJobs(
    { categoryId: selectedCategoryId ?? undefined, pageSize: 100 },
    { query: { enabled: !!selectedCategoryId } },
  );
  const jobs = jobsData?.items ?? [];

  const { mutateAsync: createJob, isPending: isCreating } = useCreateMasterJob({
    mutation: {
      onSuccess: async () => {
        resetForm();
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: 'Service added',
          message: 'Your service has been added successfully.',
          color: 'green',
        });
        onSuccess?.();
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to add service',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  const canSubmit = !!selectedJobId && !!title.trim() && price !== '' && duration !== '';

  const resetForm = () => {
    setSelectedCategoryId(null);
    setSelectedJobId(null);
    setTitle('');
    setPrice('');
    setDuration('');
  };

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

  const handleAdd = async () => {
    if (!canSubmit || !selectedJobId) {
      return;
    }
    await createJob({
      id: masterId,
      data: {
        masterId,
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
    <Stack gap="md">
      <Text c="dimmed" size="sm">
        Select a category first, then choose the service you want to offer
      </Text>
      <SimpleGrid
        cols={{
          base: 1, sm: 2,
        }}
        spacing="md"
      >
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
      </SimpleGrid>
      <Button
        leftSection={<IconPlus size={16} />}
        disabled={!canSubmit}
        loading={isCreating}
        onClick={handleAdd}
        color="brand"
      >
        Add service
      </Button>
    </Stack>
  );
}
