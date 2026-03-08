import {
  Box, Group, Stack, UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconClock,
  IconHelpCircle,
  IconLayoutDashboard,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { FileRoutesByTo } from '@/routeTree.gen';

const NAV_ITEMS: { icon: typeof IconLayoutDashboard; href: keyof FileRoutesByTo; exact?: boolean }[] = [
  { icon: IconLayoutDashboard, href: '/master', exact: true },
  { icon: IconCalendarEvent, href: '/master/bookings' },
  { icon: IconClock, href: '/master/time-slots' },
  { icon: IconSparkles, href: '/master/services' },
  { icon: IconSettings, href: '/master/settings' },
  { icon: IconHelpCircle, href: '/how-to' },
];

export default function MasterBottomNav() {
  const isMobile = useMediaQuery('(max-width: 61.9375em)', true);
  const location = useLocation();
  const navigate = useNavigate();

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
          icon: Icon, href, exact,
        }) => {
          const isActive = exact
            ? location.pathname === href || location.pathname === `${href}/`
            : location.pathname.startsWith(href);

          return (
            <UnstyledButton
              key={href}
              onClick={() => navigate({ to: href })}
            >
              <Stack gap={2} align="center" py={6}>
                <Icon
                  size={24}
                  color={isActive ? 'var(--mantine-color-pink-6)' : 'var(--mantine-color-gray-5)'}
                />
              </Stack>
            </UnstyledButton>
          );
        })}
      </Group>
    </Box>
  );
}
