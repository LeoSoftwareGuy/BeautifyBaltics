import { useTranslation } from 'react-i18next';
import {
  Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconClock,
  IconLayoutDashboard,
  IconLogout,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';

import NavigationItem from '../main-navigation/navigation-item';

export default function MasterNavigation() {
  const { logout } = useSession();
  const navigate = useNavigate();
  const layout = useLayout();
  const { t } = useTranslation();

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
