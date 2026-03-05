import { useTranslation } from 'react-i18next';
import {
  NumberInput, Select, SimpleGrid, Skeleton, TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

import { useTranslateData } from '@/hooks/use-translate-data';
import { useFindJobCategories, useFindJobs } from '@/state/endpoints/jobs';

import type { MasterServicesFormValues } from './types';

interface BaseMasterServicesFormProps {
  form: UseFormReturnType<MasterServicesFormValues>;
}

export function BaseMasterServicesForm({ form }: BaseMasterServicesFormProps) {
  const { t } = useTranslation();
  const { translateCategory, translateService } = useTranslateData();

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFindJobCategories({ pageSize: 100 });
  const categories = categoriesData?.items ?? [];

  const { data: jobsData, isLoading: isJobsLoading } = useFindJobs(
    { categoryId: form.values.categoryId ?? undefined, pageSize: 100 },
    { query: { enabled: !!form.values.categoryId } },
  );
  const jobs = jobsData?.items ?? [];

  const handleCategoryChange = (categoryId: string | null) => {
    form.setValues({
      categoryId,
      jobId: null,
      title: '',
      duration: '',
    });
  };

  const handleJobChange = (jobId: string | null) => {
    if (jobId) {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        form.setValues({ jobId, title: job.name, duration: job.durationMinutes });
        return;
      }
    }
    form.setFieldValue('jobId', jobId);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {isCategoriesLoading ? (
        <Skeleton height={36} radius="sm" />
      ) : (
        <Select
          label={t('master.services.form.categoryLabel')}
          placeholder={t('master.services.form.categoryPlaceholder')}
          searchable
          data={categories
            .filter((cat): cat is typeof cat & { id: string; name: string } => Boolean(cat.id && cat.name))
            .map((cat) => ({ value: cat.id, label: translateCategory(cat.name) }))}
          value={form.values.categoryId}
          onChange={handleCategoryChange}
        />
      )}

      {isJobsLoading && form.values.categoryId ? (
        <Skeleton height={36} radius="sm" />
      ) : (
        <Select
          label={t('master.services.form.serviceLabel')}
          placeholder={form.values.categoryId
            ? t('master.services.form.servicePlaceholder')
            : t('master.services.form.selectCategoryFirst')}
          searchable
          disabled={!form.values.categoryId}
          data={jobs.map((job) => ({ value: job.id, label: translateService(job.name) }))}
          value={form.values.jobId}
          onChange={handleJobChange}
        />
      )}

      <TextInput
        label={t('master.services.form.titleLabel')}
        placeholder={t('master.services.form.titlePlaceholder')}
        {...form.getInputProps('title')}
      />

      <NumberInput
        label={t('master.services.form.priceLabel')}
        placeholder={t('master.services.form.pricePlaceholder')}
        min={0}
        decimalScale={2}
        {...form.getInputProps('price')}
      />

      <NumberInput
        label={t('master.services.form.durationLabel')}
        placeholder={t('master.services.form.durationPlaceholder')}
        min={5}
        step={5}
        {...form.getInputProps('duration')}
      />
    </SimpleGrid>
  );
}
