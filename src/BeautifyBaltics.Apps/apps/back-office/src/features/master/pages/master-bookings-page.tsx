import { useTranslation } from 'react-i18next';
import {
  Box, Stack, Text, Title,
} from '@mantine/core';

import { MasterBookingsDataTable } from '../master-bookings-data-table';

function MasterBookingsPage() {
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>{t('master.bookings.page.title')}</Title>
        <Text c="dimmed" size="sm">
          {t('master.bookings.page.subtitle')}
        </Text>
      </Box>
      <Stack gap="xl" px="md" pb="xl">
        <MasterBookingsDataTable />
      </Stack>
    </Box>
  );
}

export default MasterBookingsPage;
