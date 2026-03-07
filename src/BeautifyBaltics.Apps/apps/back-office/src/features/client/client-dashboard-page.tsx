import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Box, Button, Container, Group, Stack, Text, Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { ClientBookingsDataTable } from './client-bookings-data-table/client-bookings-data-table';

function ClientDashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      {/* Mobile header */}
      <Box hiddenFrom="md" px="md" pt="lg" pb="md">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2} style={{ fontFamily: '"Playfair Display", serif' }}>
              {t('client.bookings.headerTitle')}
            </Title>
            <Text c="dimmed" size="sm" mt={4}>{t('client.bookings.headerSubtitle')}</Text>
          </div>
          <ActionIcon
            size={52}
            radius="xl"
            color="pink"
            variant="filled"
            style={{ boxShadow: '0 4px 12px rgba(216,85,122,0.3)', flexShrink: 0 }}
            onClick={() => navigate({ to: '/explore' })}
            aria-label={t('client.bookings.bookCta')}
          >
            <IconPlus size={24} />
          </ActionIcon>
        </Group>
      </Box>

      {/* Desktop header */}
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
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

      {/* Content */}
      <Box px={{ base: 'md', md: 0 }} pb="xl">
        <Container size="lg">
          <Stack gap="xl">
            <ClientBookingsDataTable />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default ClientDashboardPage;
