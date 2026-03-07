import { useTranslation } from 'react-i18next';
import {
  Affix,
  Group,
  Paper,
  rem,
  Tooltip,
} from '@mantine/core';
import { IconHelp, IconUserPlus } from '@tabler/icons-react';
import { UserRound } from 'lucide-react';

import { useSession } from '@/contexts/session-context';
import type { FileRouteTypes } from '@/routeTree.gen';

import ActionIconLink from './action-icon-link';
import ButtonLink from './button-link';

type RoutePath = FileRouteTypes['to'];
const DEFAULT_REDIRECT: RoutePath = '/home';

const paperStyle = {
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderRadius: 999,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
};

export default function AuthQuickActions() {
  const { user } = useSession();
  const { t } = useTranslation();

  if (user) return null;

  return (
    <Affix withinPortal={false} position={{ top: rem(16), right: rem(16) }} zIndex={200}>
      {/* Mobile: icons only */}
      <Paper px={6} py={6} withBorder style={paperStyle} hiddenFrom="md">
        <Group gap={4} wrap="nowrap">
          <Tooltip label={t('auth.quickAccess.signIn')} openDelay={200}>
            <ActionIconLink
              to="/login"
              search={() => ({ redirect: DEFAULT_REDIRECT })}
              aria-label={t('auth.quickAccess.signIn')}
              variant="subtle"
              color="pink"
              radius="xl"
              size="md"
            >
              <UserRound size={16} />
            </ActionIconLink>
          </Tooltip>
          <Tooltip label={t('auth.quickAccess.createAccount')} openDelay={200}>
            <ActionIconLink
              to="/register"
              search={() => ({ redirect: DEFAULT_REDIRECT })}
              aria-label={t('auth.quickAccess.createAccount')}
              variant="filled"
              color="pink"
              radius="xl"
              size="md"
            >
              <IconUserPlus size={16} />
            </ActionIconLink>
          </Tooltip>
          <Tooltip label={t('navigation.client.howTo')} openDelay={200}>
            <ActionIconLink
              to="/how-to"
              aria-label={t('navigation.client.howTo')}
              variant="subtle"
              color="pink"
              radius="xl"
              size="md"
            >
              <IconHelp size={16} />
            </ActionIconLink>
          </Tooltip>
        </Group>
      </Paper>

      {/* Desktop: text buttons */}
      <Paper px="xs" py={6} withBorder style={paperStyle} visibleFrom="md">
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
          <ButtonLink
            to="/how-to"
            variant="subtle"
            size="xs"
            radius="xl"
            color="pink"
          >
            {t('navigation.client.howTo')}
          </ButtonLink>
        </Group>
      </Paper>
    </Affix>
  );
}
