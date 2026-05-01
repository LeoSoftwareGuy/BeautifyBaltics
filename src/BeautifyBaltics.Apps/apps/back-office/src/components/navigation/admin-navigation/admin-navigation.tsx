import { useTranslation } from 'react-i18next';
import {
  Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconLayoutDashboard,
  IconLogout,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';

import NavigationItem from '../main-navigation/navigation-item';

export default function AdminNavigation() {
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
      <NavigationItem icon={IconLayoutDashboard} label={t('navigation.admin.dashboard')} href="/admin" />
      <NavigationItem icon={IconUsers} label={t('navigation.admin.users')} href="/admin/users" />
      <NavigationItem icon={IconCalendarEvent} label={t('navigation.admin.bookings')} href="/admin/bookings" />
      <NavigationItem icon={IconSparkles} label={t('navigation.admin.services')} href="/admin/services" />

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
