import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Group, Modal, Stack, TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

import {
  getGetServiceStatisticsQueryKey,
  useAdminCreateJobCategory,
  useAdminUpdateJobCategory,
} from '@/state/endpoints/admin';
import { FindJobCategoriesResponse } from '@/state/endpoints/api.schemas';
import { getFindJobCategoriesQueryKey } from '@/state/endpoints/jobs';

type AdminCategoryFormModalProps = {
  opened: boolean;
  onClose: () => void;
  category?: FindJobCategoriesResponse | null;
};

export function AdminCategoryFormModal({ opened, onClose, category }: AdminCategoryFormModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  useEffect(() => {
    if (opened) {
      setName(category?.name ?? '');
    }
  }, [opened, category]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getFindJobCategoriesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetServiceStatisticsQueryKey() });
  };

  const { mutate: createCategory, isPending: isCreating } = useAdminCreateJobCategory({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.services.categoryModal.notifications.createSuccess'), color: 'green' });
        invalidate();
        onClose();
      },
      onError: () => {
        notifications.show({ title: t('admin.services.categoryModal.notifications.errorTitle'), message: t('admin.services.categoryModal.notifications.error'), color: 'red' });
      },
    },
  });

  const { mutate: updateCategory, isPending: isUpdating } = useAdminUpdateJobCategory({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.services.categoryModal.notifications.updateSuccess'), color: 'green' });
        invalidate();
        onClose();
      },
      onError: () => {
        notifications.show({ title: t('admin.services.categoryModal.notifications.errorTitle'), message: t('admin.services.categoryModal.notifications.error'), color: 'red' });
      },
    },
  });

  const handleSubmit = () => {
    if (category) {
      updateCategory({ id: category.id ?? '', data: { id: category.id ?? '', name } });
    } else {
      createCategory({ data: { name } });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={category ? t('admin.services.categoryModal.editTitle') : t('admin.services.categoryModal.createTitle')}
      size="sm"
    >
      <Stack gap="sm">
        <TextInput
          label={t('admin.services.categoryModal.fields.name')}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={isPending}>
            {t('admin.services.categoryModal.submit')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
