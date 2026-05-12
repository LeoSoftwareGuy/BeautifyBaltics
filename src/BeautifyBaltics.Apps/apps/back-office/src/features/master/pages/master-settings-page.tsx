import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Alert, Box, Button, Card, Group, Stack, Text, Title,
} from '@mantine/core';
import { IconArrowLeft, IconLogout, IconShieldCheck } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { KycStatus } from '@/state/endpoints/api.schemas';
import { useGetMasterById } from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

import MasterProfileSettings from '../master-profile-settings';
import { MasterSchedulingSettings } from '../master-scheduling-settings';

function MasterSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useSession();

  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';

  const { data: masterData } = useGetMasterById(
    masterId,
    { id: masterId },
    { query: { enabled: !!masterId } },
  );

  const kycStatus = masterData?.kycStatus;
  const isKycApproved = kycStatus === KycStatus.Approved;
  const isKycPending = kycStatus === KycStatus.Pending;
  const isKycLocked = !isKycApproved && !isKycPending;

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login', search: { redirect: '/home', registered: false }, replace: true });
    } catch { /* empty */ }
  };

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
        {/* KYC status banner — links to KYC page */}
        {!isKycApproved && (
          <Alert
            icon={<IconShieldCheck size={16} />}
            color={isKycPending ? 'blue' : 'orange'}
            variant="light"
          >
            <Group justify="space-between" align="center" wrap="nowrap">
              <Text size="sm">
                <strong>{t('master.settings.kyc.softLock.title')}</strong>
                {' — '}
                {t('master.settings.kyc.softLock.message')}
              </Text>
              <Button
                size="xs"
                color={isKycPending ? 'blue' : 'orange'}
                variant="light"
                onClick={() => navigate({ to: '/master/kyc', search: {} })}
              >
                {t('master.settings.kyc.softLock.action')}
              </Button>
            </Group>
          </Alert>
        )}

        {/* Profile settings */}
        <Card withBorder>
          <MasterProfileSettings isKycLocked={isKycLocked} />
        </Card>

        {/* Scheduling settings */}
        <Card withBorder>
          <MasterSchedulingSettings isKycLocked={isKycLocked} />
        </Card>

        <Button
          hiddenFrom="md"
          variant="light"
          color="red"
          size="md"
          radius="xl"
          leftSection={<IconLogout size={18} />}
          onClick={handleLogout}
        >
          {t('actions.logout')}
        </Button>
      </Stack>
    </Box>
  );
}

export default MasterSettingsPage;
