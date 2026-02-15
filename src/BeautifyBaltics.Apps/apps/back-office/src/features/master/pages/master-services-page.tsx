import {
  Box, Stack, Text, Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { MasterServices } from '../master-services/master-services';

function MasterServicesPage() {
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>{t('master.services.page.title')}</Title>
        <Text c="dimmed" size="sm">
          {t('master.services.page.subtitle')}
        </Text>
      </Box>
      <Stack gap="xl" px="md" pb="xl">
        <MasterServices />
      </Stack>
    </Box>
  );
}

export default MasterServicesPage;
