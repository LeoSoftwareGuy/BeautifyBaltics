import { useTranslation } from 'react-i18next';
import {
  Affix,
  Group,
  Paper,
  rem,
  Tooltip,
} from '@mantine/core';
import { UserRound } from 'lucide-react';

import { useSession } from '@/contexts/session-context';
import type { FileRouteTypes } from '@/routeTree.gen';

import ActionIconLink from './action-icon-link';
import ButtonLink from './button-link';

type RoutePath = FileRouteTypes['to'];
const DEFAULT_REDIRECT: RoutePath = '/home';

export default function AuthQuickActions() {
  const { user } = useSession();
  const { t } = useTranslation();

  if (user) return null;

  return (
    <Affix withinPortal={false} position={{ top: rem(16), right: rem(16) }} zIndex={200}>
      <Paper
        px="xs"
        py={6}
        withBorder
        style={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderRadius: 999,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <Tooltip label={t('auth.quickAccess.signIn')} openDelay={200}>
            <ActionIconLink
              to="/login"
              search={() => ({ redirect: DEFAULT_REDIRECT })}
              aria-label={t('auth.quickAccess.signIn')}
              variant="subtle"
              color="pink"
              radius="xl"
              size="lg"
            >
              <UserRound size={18} />
            </ActionIconLink>
          </Tooltip>
          <ButtonLink
            to="/register"
            search={() => ({ redirect: DEFAULT_REDIRECT })}
            size="xs"
            radius="xl"
            color="pink"
            variant="filled"
          >
            {t('auth.quickAccess.createAccount')}
          </ButtonLink>
        </Group>
      </Paper>
    </Affix>
  );
}
