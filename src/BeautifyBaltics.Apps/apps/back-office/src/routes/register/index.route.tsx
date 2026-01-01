import {
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createFileRoute } from '@tanstack/react-router';

import { supabase } from '@/integrations/supabase/client';
import type { FileRouteTypes } from '@/routeTree.gen';
import { normalizeRoutePath, redirectIfAuthenticated } from '@/utils/auth';

type RoutePath = FileRouteTypes['to'];
type RegisterSearch = {
  redirect: RoutePath;
};

export const Route = createFileRoute('/register/')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    redirect: normalizeRoutePath(typeof search.redirect === 'string' ? search.redirect : undefined),
  }),
  beforeLoad: async ({ search }) => {
    await redirectIfAuthenticated(search.redirect ?? '/home');
    return {
      breadcrumbs: [{ title: 'Register', path: '/register' }],
    };
  },
  component: RegisterView,
});

function RegisterView() {
  const search = Route.useSearch();
  const redirectPath = search.redirect || '/home';
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}${redirectPath === '/' ? '' : redirectPath}`
    : undefined;

  return (
    <Stack align="center" justify="center" mih="calc(100vh - 120px)">
      <Paper withBorder p="xl" radius="lg" miw={360}>
        <Stack>
          <div>
            <Title order={3}>Create an account</Title>
            <Text c="dimmed" fz="sm">
              Register to access Beautify Baltics.
            </Text>
          </div>
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            redirectTo={redirectTo}
            providers={[]}
            appearance={{ theme: ThemeSupa }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Password',
                },
              },
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
