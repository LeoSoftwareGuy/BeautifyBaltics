import {
  Alert, Loader, Stack, Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useGetUser } from '@/state/endpoints/users';

import { MasterServicesList } from './master-services-list/master-services-list';

export function MasterServices() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';
  const { t } = useTranslation();

  if (isUserLoading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="lg" />
        <Text c="dimmed">{t('master.services.loading')}</Text>
      </Stack>
    );
  }

  if (!masterId) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={t('master.services.error.title')} color="red">
        {t('master.services.error.message')}
      </Alert>
    );
  }

  return <MasterServicesList masterId={masterId} />;
}
