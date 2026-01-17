import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  NumberInput,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { useFindJobs } from '@/state/endpoints/jobs';
import { getFindMasterJobsQueryKey, useCreateMasterJob } from '@/state/endpoints/masters';

type MasterTreatmentsFormProps = {
  masterId: string;
};

export function MasterTreatmentsForm({ masterId }: MasterTreatmentsFormProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');

  const queryClient = useQueryClient();

  const { data: jobsData, isLoading: isJobsLoading } = useFindJobs({ pageSize: 100 });
  const jobs = jobsData?.items ?? [];

  const { mutateAsync: createJob, isPending: isCreating } = useCreateMasterJob({
    mutation: {
      onSuccess: async () => {
        resetForm();
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: 'Treatment added',
          message: 'Your treatment has been added successfully.',
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to add treatment',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  const canSubmit = !!selectedJobId && !!title.trim() && price !== '' && duration !== '';

  const resetForm = () => {
    setSelectedJobId(null);
    setTitle('');
    setPrice('');
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
    <Card withBorder radius="md">
      <Stack gap="md">
        <div>
          <Title order={3}>Add Treatment</Title>
          <Text c="dimmed" size="sm">
            Add beauty procedures you can perform
          </Text>
        </div>
        <SimpleGrid
          cols={{
            base: 1, xs: 2, sm: 3, lg: 5,
          }}
          spacing="md"
        >
          {isJobsLoading ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            <Select
              label="Treatment"
              placeholder="Select treatment"
              searchable
              data={jobs.map((job) => ({
                value: job.id,
                label: `${job.name} (${job.categoryName})`,
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
          <Box style={{ alignSelf: 'flex-end' }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              disabled={!canSubmit}
              loading={isCreating}
              onClick={handleAdd}
              color="pink"
            >
              Add treatment
            </Button>
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
