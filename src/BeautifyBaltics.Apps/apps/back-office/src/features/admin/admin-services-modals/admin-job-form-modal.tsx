import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

import { getGetServiceStatisticsQueryKey, useAdminCreateJob, useAdminUpdateJob } from '@/state/endpoints/admin';
import { FindJobsResponse } from '@/state/endpoints/api.schemas';
import { getFindJobsQueryKey, useFindJobCategories } from '@/state/endpoints/jobs';

type JobFormState = {
  name: string;
  categoryId: string;
  description: string;
};

const DEFAULT_FORM: JobFormState = {
  name: '',
  categoryId: '',
  description: '',
};

type AdminJobFormModalProps = {
  opened: boolean;
  onClose: () => void;
  job?: FindJobsResponse | null;
};

export function AdminJobFormModal({ opened, onClose, job }: AdminJobFormModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<JobFormState>(DEFAULT_FORM);

  const { data: categoriesData } = useFindJobCategories({ all: true });
  const categoryOptions = (categoriesData?.items ?? []).map((c) => ({
    value: c.id ?? '',
    label: c.name ?? '',
  }));

  useEffect(() => {
    if (opened) {
      setForm(
        job
          ? {
            name: job.name,
            categoryId: job.categoryId,
            description: job.description,
          }
          : DEFAULT_FORM,
      );
    }
  }, [opened, job]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getFindJobsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetServiceStatisticsQueryKey() });
  };

  const { mutate: createJob, isPending: isCreating } = useAdminCreateJob({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.services.jobModal.notifications.createSuccess'), color: 'green' });
        invalidate();
        onClose();
      },
      onError: () => {
        notifications.show({ title: t('admin.services.jobModal.notifications.errorTitle'), message: t('admin.services.jobModal.notifications.error'), color: 'red' });
      },
    },
  });

  const { mutate: updateJob, isPending: isUpdating } = useAdminUpdateJob({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.services.jobModal.notifications.updateSuccess'), color: 'green' });
        invalidate();
        onClose();
      },
      onError: () => {
        notifications.show({ title: t('admin.services.jobModal.notifications.errorTitle'), message: t('admin.services.jobModal.notifications.error'), color: 'red' });
      },
    },
  });

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      description: form.description,
    };

    if (job) {
      updateJob({ id: job.id, data: { ...payload, jobId: job.id } });
    } else {
      createJob({ data: payload });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={job ? t('admin.services.jobModal.editTitle') : t('admin.services.jobModal.createTitle')}
      size="md"
    >
      <Stack gap="sm">
        <TextInput
          label={t('admin.services.jobModal.fields.name')}
          value={form.name}
          onChange={(e) => { const { value } = e.currentTarget; setForm((f) => ({ ...f, name: value })); }}
          required
        />
        <Select
          label={t('admin.services.jobModal.fields.category')}
          data={categoryOptions}
          value={form.categoryId || null}
          onChange={(v) => setForm((f) => ({ ...f, categoryId: v ?? '' }))}
          searchable
          required
        />
        <Textarea
          label={t('admin.services.jobModal.fields.description')}
          value={form.description}
          onChange={(e) => { const { value } = e.currentTarget; setForm((f) => ({ ...f, description: value })); }}
          minRows={3}
          required
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={isPending}>
            {t('admin.services.jobModal.submit')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
