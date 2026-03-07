import { useTranslation } from 'react-i18next';
import {
  Box, Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconDashboard,
  IconHome,
  IconLogout,
  IconMap2,
  IconStar,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { FileRoutesByTo } from '@/routeTree.gen';

const NAV_ITEMS: { icon: typeof IconHome; labelKey: string; href: keyof FileRoutesByTo; exact?: boolean }[] = [
  {
    icon: IconHome, labelKey: 'navigation.client.home', href: '/home', exact: true,
  },
  { icon: IconDashboard, labelKey: 'navigation.client.dashboard', href: '/dashboard' },
  { icon: IconStar, labelKey: 'navigation.client.topMasters', href: '/top-masters' },
  { icon: IconMap2, labelKey: 'navigation.client.mapExplore', href: '/explore' },
];

export default function ClientBottomNav() {
  const isMobile = useMediaQuery('(max-width: 61.9375em)', true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useSession();
  const { t } = useTranslation();

  if (isMobile === false) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login', search: { redirect: '/home', registered: false }, replace: true });
    } catch { /* empty */ }
  };

  return (
    <Box
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      style={{
        borderTop: '1px solid var(--mantine-color-gray-2)',
        zIndex: 200,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <Group grow gap={0} px="xs" py={6}>
        {NAV_ITEMS.map(({ icon: Icon, labelKey, href, exact }) => {
          const isActive = exact
            ? location.pathname === href || location.pathname === `${href}/`
            : location.pathname.startsWith(href);

          return (
            <UnstyledButton
              key={href}
              onClick={() => navigate({ to: href })}
            >
              <Stack gap={2} align="center" py={4}>
                <Icon
                  size={22}
                  color={isActive ? 'var(--mantine-color-pink-6)' : 'var(--mantine-color-gray-5)'}
                />
                <Text size="xs" c={isActive ? 'pink' : 'dimmed'} fw={isActive ? 700 : 400} lh={1}>
                  {t(labelKey)}
                </Text>
              </Stack>
            </UnstyledButton>
          );
        })}

        <UnstyledButton onClick={handleLogout}>
          <Stack gap={2} align="center" py={4}>
            <IconLogout size={22} color="var(--mantine-color-red-5)" />
            <Text size="xs" c="red.5" lh={1}>
              {t('actions.logout')}
            </Text>
          </Stack>
        </UnstyledButton>
      </Group>
    </Box>
  );
}
