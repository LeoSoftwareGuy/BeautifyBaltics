import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Group, Stack, Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

import type { DrawerButtonContentProps } from '@/components/ui/drawer-button';
import type { MasterJobDTO } from '@/state/endpoints/api.schemas';
import { getFindMasterJobsQueryKey, useUpdateMasterJob } from '@/state/endpoints/masters';

import { BaseMasterServicesForm } from './base-master-services-form';
import type { MasterServicesFormValues } from './types';
import { isFormValid } from './validators';

interface EditMasterServicesFormProps extends DrawerButtonContentProps {
  masterId: string;
  service: MasterJobDTO;
}

export function EditMasterServicesForm({ masterId, service, onCancel }: EditMasterServicesFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<MasterServicesFormValues>({
    initialValues: {
      categoryId: service.jobCategoryId ?? null,
      jobId: service.jobId ?? null,
      title: service.title ?? service.jobName ?? '',
      price: service.price ?? '',
      duration: service.durationMinutes ?? '',
    },
  });

  useEffect(() => {
    form.setValues({
      categoryId: service.jobCategoryId ?? null,
      jobId: service.jobId ?? null,
      title: service.title ?? service.jobName ?? '',
      price: service.price ?? '',
      duration: service.durationMinutes ?? '',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.id]);

  const { mutateAsync: updateJob, isPending } = useUpdateMasterJob({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: t('master.services.notifications.updateSuccessTitle'),
          message: t('master.services.notifications.updateSuccessMessage'),
          color: 'green',
        });
        await onCancel();
      },
      onError: (error) => {
        notifications.show({
          title: t('master.services.notifications.updateErrorTitle'),
          message: error.detail ?? t('master.services.notifications.updateErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleSubmit = async () => {
    if (!isFormValid(form.values) || !form.values.jobId) return;
    await updateJob({
      id: masterId,
      jobId: service.id,
      data: {
        masterId,
        masterJobId: service.id,
        job: {
          jobId: form.values.jobId,
          title: form.values.title.trim(),
          price: typeof form.values.price === 'number' ? form.values.price : parseFloat(String(form.values.price)),
          durationMinutes: typeof form.values.duration === 'number' ? form.values.duration : parseInt(String(form.values.duration), 10),
        },
      },
    });
  };

  return (
    <Stack gap="md">
      <Text c="dimmed" size="sm">
        {t('master.services.modals.editDescription')}
      </Text>
      <BaseMasterServicesForm form={form} />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
        <Button
          color="brand"
          disabled={!isFormValid(form.values)}
          loading={isPending}
          onClick={handleSubmit}
        >
          {t('master.services.form.saveChanges')}
        </Button>
      </Group>
    </Stack>
  );
}
