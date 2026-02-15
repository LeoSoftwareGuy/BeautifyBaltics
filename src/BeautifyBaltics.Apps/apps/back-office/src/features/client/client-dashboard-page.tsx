import { useTranslation } from 'react-i18next';
import {
  Box, Button, Container, Group, Stack, Text, Title,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import { ClientBookingsDataTable } from './client-bookings-data-table/client-bookings-data-table';

function ClientDashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Container size="lg">
          <Group justify="space-between">
            <div>
              <Title order={2}>{t('client.bookings.headerTitle')}</Title>
              <Text c="dimmed" size="sm">{t('client.bookings.headerSubtitle')}</Text>
            </div>
            <Button onClick={() => navigate({ to: '/explore' })}>{t('client.bookings.bookCta')}</Button>
          </Group>
        </Container>
      </Box>

      <Container size="lg" pb="xl">
        <Stack gap="xl">
          <ClientBookingsDataTable />
        </Stack>
      </Container>
    </Box>
  );
}

export default ClientDashboardPage;
