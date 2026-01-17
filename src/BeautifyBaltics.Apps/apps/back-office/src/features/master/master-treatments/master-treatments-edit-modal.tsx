import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

import type { MasterJobDTO } from '@/state/endpoints/api.schemas';
import { useFindJobs } from '@/state/endpoints/jobs';
import { getFindMasterJobsQueryKey, useUpdateMasterJob } from '@/state/endpoints/masters';

type MasterTreatmentsEditModalProps = {
  opened: boolean;
  onClose: () => void;
  masterId: string;
  treatment: MasterJobDTO | null;
};

export function MasterTreatmentsEditModal({
  opened,
  onClose,
  masterId,
  treatment,
}: MasterTreatmentsEditModalProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');

  const queryClient = useQueryClient();

  const { data: jobsData, isLoading: isJobsLoading } = useFindJobs({ pageSize: 100 });
  const jobs = jobsData?.items ?? [];

  const { mutateAsync: updateJob, isPending: isUpdating } = useUpdateMasterJob({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: 'Treatment updated',
          message: 'Your treatment has been updated successfully.',
          color: 'green',
        });
        onClose();
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to update treatment',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  useEffect(() => {
    if (treatment) {
      setSelectedJobId(treatment.jobId);
      setTitle(treatment.title ?? treatment.jobName ?? '');
      setPrice(treatment.price ?? '');
      setDuration(treatment.durationMinutes ?? '');
    }
  }, [treatment]);

  const canSubmit = !!selectedJobId && !!title.trim() && price !== '' && duration !== '';

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
    if (!canSubmit || !selectedJobId || !treatment?.id) {
      return;
    }
    await updateJob({
      id: masterId,
      jobId: treatment.id,
      data: {
        masterId,
        masterJobId: treatment.id,
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
      title="Edit Treatment"
      size="md"
      centered
    >
      <Stack gap="md">
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
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="pink"
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
