import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconArrowRight } from '@tabler/icons-react';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import type { FileRouteTypes } from '@/routeTree.gen';
import { UserRole } from '@/state/endpoints/api.schemas';
import { normalizeRoutePath } from '@/utils/auth';

import { AnchorLink } from '../../components/navigation';

type RoutePath = FileRouteTypes['to'];
type LoginSearch = {
  redirect: RoutePath;
  registered?: boolean;
  verified?: boolean;
};

export const Route = createFileRoute('/login/')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const redirect = typeof search.redirect === 'string' ? search.redirect : undefined;
    const normalizedRedirect = normalizeRoutePath(redirect);
    return {
      redirect: normalizedRedirect,
      registered: search.registered === true || search.registered === 'true',
      verified: search.verified === true || search.verified === 'true',
    };
  },
  beforeLoad: () => ({
    breadcrumbs: [{ titleKey: 'navigation.breadcrumbs.login', path: '/login' }],
  }),
  component: LoginView,
});

type LoginFormValues = {
  email: string;
  password: string;
};

type ResetFormValues = {
  email: string;
};

const rolePillStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  height: 44,
  borderRadius: 8,
  border: 'none',
  background: active ? '#fff' : 'transparent',
  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
  color: active ? '#d8557a' : '#6b7280',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
});

function LoginView() {
  const search = Route.useSearch();
  const router = useRouter();
  const { t } = useTranslation();
  const { login, isAuthenticated, loading } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showRegistered] = useState(search.registered === true);
  const [showVerified] = useState(search.verified === true);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [accountRole, setAccountRole] = useState<UserRole>(UserRole.Client);
  const [resetRole, setResetRole] = useState<UserRole>(UserRole.Client);
  const redirectPath: RoutePath = search.redirect;
  const isDesktop = useMediaQuery('(min-width: 75em)');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.navigate({ to: redirectPath, replace: true });
    }
  }, [isAuthenticated, loading, redirectPath, router]);

  useEffect(() => {
    if (search.registered || search.verified) {
      router.navigate({
        to: '/login',
        search: { redirect: redirectPath },
        replace: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Enter a valid email address'),
      password: (value) => (value.length ? null : 'Password is required'),
    },
  });

  const resetForm = useForm<ResetFormValues>({
    initialValues: { email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Enter a valid email address'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitting(true);
    setEmailNotVerified(false);
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
        role: accountRole,
      });
      router.navigate({ to: redirectPath, replace: true });
    } catch (error) {
      if (error && typeof error === 'object' && 'detail' in error) {
        if (error.detail === 'email_not_verified') {
          setEmailNotVerified(true);
        } else {
          notifications.show({ title: 'Sign in failed', message: String(error.detail), color: 'red' });
        }
      } else {
        const message = error instanceof Error ? error.message : 'Sign in failed. Please try again.';
        notifications.show({ title: 'Sign in failed', message, color: 'red' });
      }
    } finally {
      setSubmitting(false);
    }
  });

  const handleResetPassword = resetForm.onSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: values.email.trim(), role: resetRole }),
      });
      if (!response.ok) throw new Error('Failed to send reset email.');
      setResetSent(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email. Please try again.';
      notifications.show({ title: 'Reset failed', message, color: 'red' });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Box style={{
      minHeight: '100vh', background: '#f8f6f6', display: 'flex', flexDirection: 'column',
    }}
    >

      {/* Mobile hero image */}
      <Box
        hiddenFrom="lg"
        style={{
          width: '100%',
          height: 240,
          backgroundImage: 'url(/salon.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #f8f6f6, transparent)',
        }}
        />
      </Box>

      {/* Desktop split + mobile form */}
      <Box style={{ display: 'flex', flex: 1 }}>

        {/* Desktop left image panel */}
        <Box
          visibleFrom="lg"
          style={{
            width: '50%',
            flexShrink: 0,
            backgroundImage: 'url(/salon.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          <Box style={{
            position: 'absolute', bottom: 48, left: 40, right: 40, zIndex: 1,
          }}
          >
            <Text fz={32} c="white" lh={1.3} mb="xs" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>
              &ldquo;Redefining beauty standards in the Baltic region.&rdquo;
            </Text>
            <Text fz="xs" c="white" fw={500} style={{ opacity: 0.8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Premium Aesthetics &amp; Wellness
            </Text>
          </Box>
        </Box>

        {/* Form panel */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isDesktop ? 'center' : 'flex-start',
            padding: isDesktop ? '3rem 1.5rem' : '1.5rem 1.5rem 2.5rem',
            background: '#fff',
          }}
        >
          <Box w="100%" maw={440}>
            {forgotPassword ? (
              <>
                <Stack gap="xs" mb="xl">
                  <Title order={1} style={{ fontFamily: '"Playfair Display", serif' }}>
                    Reset password
                  </Title>
                  <Text c="dimmed" fz="sm">
                    Enter your email and we&apos;ll send you a link to reset your password.
                  </Text>
                </Stack>

                {resetSent ? (
                  <Alert color="teal" title="Check your inbox" variant="light" mb="lg">
                    A password reset link has been sent to your email address.
                  </Alert>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <Stack gap="md">
                      <Stack gap={8}>
                        <Text size="sm" fw={600}>{t('auth.login.accountTypeLabel')}</Text>
                        <Box style={{
                          background: 'rgba(216,85,122,0.1)', borderRadius: 12, padding: 4, display: 'flex',
                        }}
                        >
                          <button type="button" style={rolePillStyle(resetRole === UserRole.Client)} onClick={() => setResetRole(UserRole.Client)}>
                            {t('auth.login.roleClient')}
                          </button>
                          <button type="button" style={rolePillStyle(resetRole === UserRole.Master)} onClick={() => setResetRole(UserRole.Master)}>
                            {t('auth.login.roleMaster')}
                          </button>
                        </Box>
                      </Stack>
                      <TextInput
                        label="Email Address"
                        placeholder="name@example.com"
                        type="email"
                        size="md"
                        radius="md"
                        {...resetForm.getInputProps('email')}
                      />
                      <Button type="submit" size="md" radius="md" loading={submitting} color="brand" fullWidth>
                        Send reset link
                      </Button>
                    </Stack>
                  </form>
                )}

                <Text c="dimmed" fz="sm" ta="center" mt="xl">
                  <Anchor fz="sm" onClick={() => { setForgotPassword(false); setResetSent(false); }}>
                    Back to sign in
                  </Anchor>
                </Text>
              </>
            ) : (
              <>
                <Stack gap="xs" mb="xl">
                  <Title order={1} style={{ fontFamily: '"Playfair Display", serif' }}>
                    Welcome back
                  </Title>
                  <Text c="dimmed" fz="sm">
                    Enter your credentials to access your account
                  </Text>
                </Stack>

                {showVerified && (
                  <Alert color="teal" title="Email verified" variant="light" mb="lg">
                    Your email has been verified. You can now sign in.
                  </Alert>
                )}
                {showRegistered && (
                  <Alert color="teal" title="Registration successful" variant="light" mb="lg">
                    Please check your inbox to verify your email before signing in.
                  </Alert>
                )}
                {emailNotVerified && (
                  <Alert color="yellow" title="Email not verified" variant="light" mb="lg">
                    Please check your inbox and verify your email before signing in.
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack gap="md">
                    {/* Segmented role switcher */}
                    <Box style={{
                      background: 'rgba(216,85,122,0.1)', borderRadius: 12, padding: 4, display: 'flex',
                    }}
                    >
                      <button type="button" style={rolePillStyle(accountRole === UserRole.Client)} onClick={() => setAccountRole(UserRole.Client)}>
                        {t('auth.login.roleClient')}
                      </button>
                      <button type="button" style={rolePillStyle(accountRole === UserRole.Master)} onClick={() => setAccountRole(UserRole.Master)}>
                        {t('auth.login.roleMaster')}
                      </button>
                    </Box>

                    <TextInput
                      label="Email Address"
                      placeholder="name@example.com"
                      type="email"
                      size="md"
                      radius="md"
                      {...form.getInputProps('email')}
                    />

                    <Box>
                      <Group justify="space-between" mb={4}>
                        <Text fz="sm" fw={500}>Password</Text>
                        <Anchor fz="xs" onClick={() => setForgotPassword(true)}>
                          Forgot password?
                        </Anchor>
                      </Group>
                      <PasswordInput
                        placeholder="••••••••"
                        size="md"
                        radius="md"
                        {...form.getInputProps('password')}
                      />
                    </Box>

                    <Button
                      type="submit"
                      size="md"
                      radius="md"
                      loading={submitting}
                      color="brand"
                      mt="xs"
                      rightSection={<IconArrowRight size={18} />}
                      fullWidth
                    >
                      Sign In
                    </Button>
                  </Stack>
                </form>

                <Text c="dimmed" fz="sm" ta="center" mt="xl">
                  New to Beautify Baltics?
                  {' '}
                  <AnchorLink to="/register" search={() => ({ redirect: redirectPath })}>
                    Create an account
                  </AnchorLink>
                </Text>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
