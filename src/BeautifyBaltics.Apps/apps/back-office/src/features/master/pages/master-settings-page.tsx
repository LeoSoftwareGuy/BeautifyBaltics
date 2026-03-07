import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Box, Card, Group, Stack, Title,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import MasterProfileSettings from '../master-profile-settings';
import { MasterSchedulingSettings } from '../master-scheduling-settings';

function MasterSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      {/* Mobile header */}
      <Box
        hiddenFrom="md"
        pos="sticky"
        top={0}
        bg="var(--mantine-color-body)"
        style={{ zIndex: 100, borderBottom: '1px solid var(--mantine-color-default-border)' }}
        px="md"
        py="sm"
      >
        <Group justify="space-between" align="center">
          <ActionIcon
            variant="subtle"
            color="pink"
            size="lg"
            radius="xl"
            onClick={() => navigate({ to: '/master' })}
            aria-label={t('actions.back')}
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={3} style={{ fontFamily: '"Playfair Display", serif' }}>
            {t('master.settings.page.title')}
          </Title>
          <Box w={36} />
        </Group>
      </Box>

      {/* Desktop header */}
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2}>{t('master.settings.page.title')}</Title>
      </Box>

      <Stack gap="xl" px="md" pb="xl" pt={{ base: 'md', md: 0 }}>
        <Card withBorder>
          <MasterProfileSettings />
        </Card>

        <Card withBorder>
          <MasterSchedulingSettings />
        </Card>
      </Stack>
    </Box>
  );
}

export default MasterSettingsPage;
