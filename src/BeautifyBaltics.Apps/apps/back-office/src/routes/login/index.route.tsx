import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import { supabase } from '@/integrations/supabase/client';
import type { FileRouteTypes } from '@/routeTree.gen';
import { normalizeRoutePath, redirectIfAuthenticated } from '@/utils/auth';

import { AnchorLink } from '../../components/navigation';

type RoutePath = FileRouteTypes['to'];
type LoginSearch = {
  redirect: RoutePath;
  registered?: boolean;
};

export const Route = createFileRoute('/login/')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const redirect = typeof search.redirect === 'string' ? search.redirect : undefined;
    const normalizedRedirect = normalizeRoutePath(redirect);

    return {
      redirect: normalizedRedirect,
      registered: Boolean(search.registered),
    };
  },
  beforeLoad: async ({ search }) => {
    await redirectIfAuthenticated(search.redirect ?? '/home');
    return {
      breadcrumbs: [{ titleKey: 'navigation.breadcrumbs.login', path: '/login' }],
    };
  },
  component: LoginView,
});

function LoginView() {
  const search = Route.useSearch();
  const router = useRouter();
  const { isAuthenticated, loading } = useSession();
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const redirectPath = search.redirect || '/home';
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}${redirectPath === '/' ? '' : redirectPath}`
    : undefined;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.navigate({ to: redirectPath, replace: true });
    }
  }, [isAuthenticated, loading, redirectPath, router]);

  return (
    <Stack align="center" justify="center" mih="calc(100vh - 120px)">
      <Paper withBorder p="xl" radius="lg" miw={360}>
        <Stack>
          <div>
            <Title order={3}>{t('auth.login.title')}</Title>
            <Text c="dimmed" fz="sm">
              {t('auth.login.subtitle')}
            </Text>
          </div>
          {search.registered ? (
            <Alert color="teal" title={t('auth.login.registeredTitle')} variant="light">
              {t('auth.login.registeredMessage')}
            </Alert>
          ) : null}
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            redirectTo={redirectTo}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#d05072',
                    brandAccent: '#d05072',
                    brandButtonText: theme.white,
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  link_text: '',
                },
                sign_in: {
                  email_label: t('auth.shared.emailLabel'),
                  password_label: t('auth.shared.passwordLabel'),
                },
              },
            }}
          />
        </Stack>
        <Text c="dimmed" fz="sm" ta="center">
          {t('auth.login.noAccount')}
          {' '}
          <AnchorLink
            to="/register"
            search={() => ({ redirect: redirectPath })}
          >
            {t('auth.login.createAccountLink')}
          </AnchorLink>
        </Text>
      </Paper>
    </Stack>
  );
}
