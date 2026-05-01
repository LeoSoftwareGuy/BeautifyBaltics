import { useTranslation } from 'react-i18next';
import {
  Box, Stack, Text, Title,
} from '@mantine/core';

import { AdminBookingsDataTable } from '../admin-bookings-data-table/admin-bookings-data-table';

function AdminBookingsPage() {
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>{t('admin.bookings.page.title')}</Title>
        <Text c="dimmed" size="sm">{t('admin.bookings.page.subtitle')}</Text>
      </Box>
      <Stack gap="xl" px={{ base: 'sm', md: 'md' }} pb="xl">
        <AdminBookingsDataTable />
      </Stack>
    </Box>
  );
}

export default AdminBookingsPage;
