import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

import { useTranslateData } from '@/hooks/use-translate-data';
import { useFindJobCategories, useFindJobs } from '@/state/endpoints/jobs';
import { getFindMasterJobsQueryKey, useCreateMasterJob } from '@/state/endpoints/masters';

type MasterServicesFormProps = {
  masterId: string;
  onSuccess?: () => void;
};

export function MasterServicesForm({ masterId, onSuccess }: MasterServicesFormProps) {
  const { translateCategory, translateService } = useTranslateData();
  const { t } = useTranslation();
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
          title: t('master.services.notifications.createSuccessTitle'),
          message: t('master.services.notifications.createSuccessMessage'),
          color: 'green',
        });
        onSuccess?.();
      },
      onError: (error) => {
        notifications.show({
          title: t('master.services.notifications.createErrorTitle'),
          message: error.detail ?? t('master.services.notifications.createErrorMessage'),
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
        {t('master.services.form.description')}
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
            label={t('master.services.form.categoryLabel')}
            placeholder={t('master.services.form.categoryPlaceholder')}
            searchable
            data={categories
              .filter((cat): cat is typeof cat & { id: string; name: string } => Boolean(cat.id && cat.name))
              .map((cat) => ({
                value: cat.id,
                label: translateCategory(cat.name),
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
            label={t('master.services.form.serviceLabel')}
            placeholder={selectedCategoryId
              ? t('master.services.form.servicePlaceholder')
              : t('master.services.form.selectCategoryFirst')}
            searchable
            disabled={!selectedCategoryId}
            data={jobs.map((job) => ({
              value: job.id,
              label: translateService(job.name),
            }))}
            value={selectedJobId}
            onChange={handleJobChange}
          />
        )}

        <TextInput
          label={t('master.services.form.titleLabel')}
          placeholder={t('master.services.form.titlePlaceholder')}
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <NumberInput
          label={t('master.services.form.priceLabel')}
          placeholder={t('master.services.form.pricePlaceholder')}
          min={0}
          decimalScale={2}
          value={price}
          onChange={handlePriceChange}
        />
        <NumberInput
          label={t('master.services.form.durationLabel')}
          placeholder={t('master.services.form.durationPlaceholder')}
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
        {t('master.services.form.submit')}
      </Button>
    </Stack>
  );
}
