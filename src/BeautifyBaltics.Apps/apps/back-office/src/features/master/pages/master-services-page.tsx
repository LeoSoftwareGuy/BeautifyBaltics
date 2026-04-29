import { useTranslation } from 'react-i18next';
import {
  Alert, Box, Stack, Text, Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { KycStatus } from '@/state/endpoints/api.schemas';
import { useGetMasterById } from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

import { MasterServices } from '../master-services/master-services';

function MasterServicesPage() {
  const { t } = useTranslation();
  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';

  const { data: masterData } = useGetMasterById(
    masterId,
    { id: masterId },
    { query: { enabled: !!masterId } },
  );

  const isKycLocked = !!masterData && masterData.kycStatus !== KycStatus.Approved;

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>{t('master.services.page.title')}</Title>
        <Text c="dimmed" size="sm">
          {t('master.services.page.subtitle')}
        </Text>
      </Box>
      <Stack gap="xl" px={{ base: 0, md: 'md' }} pb="xl">
        {isKycLocked && (
          <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
            <strong>{t('master.settings.kyc.softLock.title')}</strong>
            {' — '}
            {t('master.settings.kyc.softLock.message')}
          </Alert>
        )}
        <MasterServices isKycLocked={isKycLocked} />
      </Stack>
    </Box>
  );
}

export default MasterServicesPage;
