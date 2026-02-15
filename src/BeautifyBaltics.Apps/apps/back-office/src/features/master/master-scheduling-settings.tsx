import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconClock, IconDeviceFloppy } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getGetMasterByIdQueryKey, useGetMasterById, useUpdateMasterBufferTime } from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

export function MasterSchedulingSettings() {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';
  const { data: master, isLoading } = useGetMasterById(masterId, { id: masterId }, { query: { enabled: !!masterId } });
  const { t } = useTranslation();

  const [bufferMinutes, setBufferMinutes] = useState<number | ''>(0);

  useEffect(() => {
    const value = master?.bufferMinutes as number | undefined;
    if (value !== undefined) {
      setBufferMinutes(value);
    }
  }, [master?.bufferMinutes]);

  const { mutateAsync: updateBuffer, isPending } = useUpdateMasterBufferTime({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetMasterByIdQueryKey(masterId, { id: masterId }) });
        notifications.show({
          title: t('master.settings.scheduling.notifications.successTitle'),
          message: t('master.settings.scheduling.notifications.successMessage'),
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: t('master.settings.scheduling.notifications.errorTitle'),
          message: t('master.settings.scheduling.notifications.errorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleSave = async () => {
    if (!masterId || bufferMinutes === '') return;
    await updateBuffer({ id: masterId, data: { masterId, bufferMinutes } });
  };

  if (isLoading) return null;

  return (
    <Stack gap="md">
      <Group gap="xs">
        <IconClock size={20} />
        <Title order={4}>{t('master.settings.scheduling.title')}</Title>
      </Group>

      <Text size="sm" c="dimmed">
        {t('master.settings.scheduling.subtitle')}
      </Text>

      <NumberInput
        label={t('master.settings.scheduling.bufferLabel')}
        placeholder="0"
        min={0}
        max={60}
        step={5}
        value={bufferMinutes}
        onChange={(value) => setBufferMinutes(value === '' || value === null ? '' : Number(value))}
        w={300}
      />

      <Group>
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          color="brand"
          onClick={handleSave}
          loading={isPending}
          disabled={bufferMinutes === ''}
        >
          {t('master.settings.scheduling.save')}
        </Button>
      </Group>
    </Stack>
  );
}
