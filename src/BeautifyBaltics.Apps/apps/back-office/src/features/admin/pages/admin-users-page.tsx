import { useTranslation } from 'react-i18next';
import {
  Box, Stack, Text, Title,
} from '@mantine/core';

import { AdminUsersDataTable } from '../admin-users-data-table/admin-users-data-table';

function AdminUsersPage() {
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>{t('admin.users.page.title')}</Title>
        <Text c="dimmed" size="sm">{t('admin.users.page.subtitle')}</Text>
      </Box>
      <Stack gap="xl" px={{ base: 'sm', md: 'md' }} pb="xl">
        <AdminUsersDataTable />
      </Stack>
    </Box>
  );
}

export default AdminUsersPage;
