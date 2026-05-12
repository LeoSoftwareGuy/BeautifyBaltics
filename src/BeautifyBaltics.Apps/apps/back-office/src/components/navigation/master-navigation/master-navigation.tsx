import { useTranslation } from 'react-i18next';
import {
  Group, Stack, Text, ThemeIcon, UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconClock,
  IconLayoutDashboard,
  IconLogout,
  IconSettings,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';
import { KycStatus } from '@/state/endpoints/api.schemas';
import { useGetMasterById } from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

import NavigationItem from '../main-navigation/navigation-item';

function KycNavIndicator({ status }: { status: KycStatus | undefined }) {
  if (status === KycStatus.Approved) return null;

  const color = status === KycStatus.Pending ? 'yellow' : 'orange';

  return (
    <ThemeIcon size={8} radius="xl" color={color} variant="filled">
      <span />
    </ThemeIcon>
  );
}

export default function MasterNavigation() {
  const { logout } = useSession();
  const navigate = useNavigate();
  const layout = useLayout();
  const { t } = useTranslation();

  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';
  const { data: masterData } = useGetMasterById(
    masterId,
    { id: masterId },
    { query: { enabled: !!masterId } },
  );
  const kycStatus = masterData?.kycStatus;

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login', search: { redirect: '/home', registered: false }, replace: true });
    } catch (error) { /* empty */ }
  };

  return (
    <Stack gap={4}>
      <NavigationItem icon={IconLayoutDashboard} label={t('navigation.master.dashboard')} href="/master" />
      <NavigationItem icon={IconCalendarEvent} label={t('navigation.master.bookings')} href="/master/bookings" />
      <NavigationItem icon={IconClock} label={t('navigation.master.timeSlots')} href="/master/time-slots" />
      <NavigationItem icon={IconSparkles} label={t('navigation.master.services')} href="/master/services" />
      <NavigationItem
        icon={IconShieldCheck}
        label={t('navigation.master.kyc')}
        href="/master/kyc"
        rightSection={<KycNavIndicator status={kycStatus} />}
      />
      <NavigationItem icon={IconSettings} label={t('navigation.master.settings')} href="/master/settings" />

      <UnstyledButton
        onClick={handleLogout}
        px="xs"
        py={8}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <Group gap="xs" wrap="nowrap">
          <IconLogout size={18} color="var(--mantine-color-red-6)" />
          {layout.navbar.collapsed ? null : (
            <Text size="sm" c="red.6">{t('actions.logout')}</Text>
          )}
        </Group>
      </UnstyledButton>
    </Stack>
  );
}
