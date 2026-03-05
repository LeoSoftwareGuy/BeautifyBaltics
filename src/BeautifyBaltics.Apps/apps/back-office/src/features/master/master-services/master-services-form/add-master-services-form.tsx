import { useTranslation } from 'react-i18next';
import { Button, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import type { DrawerButtonContentProps } from '@/components/ui/drawer-button';
import { getFindMasterJobsQueryKey, useCreateMasterJob } from '@/state/endpoints/masters';

import { BaseMasterServicesForm } from './base-master-services-form';
import type { MasterServicesFormValues } from './types';
import { isFormValid } from './validators';

interface AddMasterServicesFormProps extends DrawerButtonContentProps {
  masterId: string;
}

export function AddMasterServicesForm({ masterId, onCancel }: AddMasterServicesFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<MasterServicesFormValues>({
    initialValues: {
      categoryId: null,
      jobId: null,
      title: '',
      price: '',
      duration: '',
    },
  });

  const { mutateAsync: createJob, isPending } = useCreateMasterJob({
    mutation: {
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: t('master.services.notifications.createSuccessTitle'),
          message: t('master.services.notifications.createSuccessMessage'),
          color: 'green',
        });
        await onCancel();
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

  const handleSubmit = async () => {
    if (!isFormValid(form.values) || !form.values.jobId) return;
    await createJob({
      id: masterId,
      data: {
        masterId,
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
        {t('master.services.form.description')}
      </Text>
      <BaseMasterServicesForm form={form} />
      <Button
        leftSection={<IconPlus size={16} />}
        disabled={!isFormValid(form.values)}
        loading={isPending}
        onClick={handleSubmit}
        color="brand"
      >
        {t('master.services.form.submit')}
      </Button>
    </Stack>
  );
}
