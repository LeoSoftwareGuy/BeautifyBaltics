import { useEffect } from 'react';
import {
  Alert,
  Paper,
  Stack,
  Text,
  Title,
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
      breadcrumbs: [{ title: 'Login', path: '/login' }],
    };
  },
  component: LoginView,
});

function LoginView() {
  const search = Route.useSearch();
  const router = useRouter();
  const { isAuthenticated, loading } = useSession();
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
            <Title order={3}>Welcome back</Title>
            <Text c="dimmed" fz="sm">
              Sign in with your Beautify Baltics account to continue.
            </Text>
          </div>
          {search.registered ? (
            <Alert color="teal" title="Registration successful" variant="light">
              Please log in with your new credentials.
            </Alert>
          ) : null}
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            redirectTo={redirectTo}
            providers={[]}
            appearance={{ theme: ThemeSupa }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                },
              },
            }}
          />
        </Stack>
        <Text c="dimmed" fz="sm" ta="center">
          Don&apos;t have an account?
          {' '}
          <AnchorLink
            to="/register"
            search={() => ({ redirect: redirectPath })}
          >
            Create one
          </AnchorLink>
        </Text>
      </Paper>
    </Stack>
  );
}
