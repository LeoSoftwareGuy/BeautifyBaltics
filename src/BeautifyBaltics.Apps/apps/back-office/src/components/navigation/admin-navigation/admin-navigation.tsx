import { useTranslation } from 'react-i18next';
import {
  Badge, Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCheckbox,
  IconLayoutDashboard,
  IconLogout,
  IconShieldCheck,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { useLayout } from '@/layouts';
import { useGetPendingKycSubmissions } from '@/state/endpoints/admin-kyc';
import { useGetPendingChangesetsCount } from '@/state/endpoints/changesets';

import NavigationItem from '../main-navigation/navigation-item';

export default function AdminNavigation() {
  const { logout } = useSession();
  const navigate = useNavigate();
  const layout = useLayout();
  const { t } = useTranslation();
  const { data: pendingCount } = useGetPendingChangesetsCount({
    query: { refetchInterval: 30_000 },
  });
  const count = pendingCount?.count ?? 0;

  const { data: pendingKyc } = useGetPendingKycSubmissions({
    query: { refetchInterval: 30_000 },
  });
  const kycCount = pendingKyc?.items?.length ?? 0;

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
      <NavigationItem
        icon={IconCheckbox}
        label={t('navigation.admin.changesets')}
        href="/admin/changesets"
        rightSection={count > 0 ? (
          <Badge size="xs" color="yellow" variant="filled" circle>{count}</Badge>
        ) : undefined}
      />
      <NavigationItem
        icon={IconShieldCheck}
        label={t('navigation.admin.kyc')}
        href="/admin/kyc"
        rightSection={kycCount > 0 ? (
          <Badge size="xs" color="orange" variant="filled" circle>{kycCount}</Badge>
        ) : undefined}
      />

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
