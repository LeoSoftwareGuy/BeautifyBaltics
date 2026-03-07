import { useTranslation } from 'react-i18next';
import {
  Box, Group, Stack, Text, UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconClock,
  IconLayoutDashboard,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { FileRoutesByTo } from '@/routeTree.gen';

const NAV_ITEMS: { icon: typeof IconLayoutDashboard; labelKey: string; href: keyof FileRoutesByTo; exact?: boolean }[] = [
  {
    icon: IconLayoutDashboard, labelKey: 'navigation.master.dashboard', href: '/master', exact: true,
  },
  { icon: IconCalendarEvent, labelKey: 'navigation.master.bookings', href: '/master/bookings' },
  { icon: IconClock, labelKey: 'navigation.master.timeSlots', href: '/master/time-slots' },
  { icon: IconSparkles, labelKey: 'navigation.master.services', href: '/master/services' },
  { icon: IconSettings, labelKey: 'navigation.master.settings', href: '/master/settings' },
];

export default function MasterBottomNav() {
  const isMobile = useMediaQuery('(max-width: 61.9375em)');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // isMobile is undefined during SSR/initial render — treat as mobile to avoid flash
  if (isMobile === false) return null;

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
        {NAV_ITEMS.map(({
          icon: Icon, labelKey, href, exact,
        }) => {
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
                <Text
                  size="xs"
                  c={isActive ? 'pink' : 'dimmed'}
                  fw={isActive ? 700 : 400}
                  lh={1}
                >
                  {t(labelKey)}
                </Text>
              </Stack>
            </UnstyledButton>
          );
        })}
      </Group>
    </Box>
  );
}
