import { useTranslation } from 'react-i18next';
import {
  Box, Stack, Text, Title,
} from '@mantine/core';

import { AdminServicesDataTable } from '../admin-services-data-table/admin-services-data-table';

function AdminServicesPage() {
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>{t('admin.services.page.title')}</Title>
        <Text c="dimmed" size="sm">{t('admin.services.page.subtitle')}</Text>
      </Box>
      <Stack gap="xl" px={{ base: 'sm', md: 'md' }} pb="xl">
        <AdminServicesDataTable />
      </Stack>
    </Box>
  );
}

export default AdminServicesPage;
