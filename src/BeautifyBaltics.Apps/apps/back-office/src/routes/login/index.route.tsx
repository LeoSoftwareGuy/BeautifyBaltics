import { useEffect, useState } from 'react';
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
import { notifications } from '@mantine/notifications';
import { IconSparkles } from '@tabler/icons-react';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useSession } from '@/contexts/session-context';
import type { FileRouteTypes } from '@/routeTree.gen';
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

function LoginView() {
  const search = Route.useSearch();
  const router = useRouter();
  const { login, isAuthenticated, loading } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showRegistered] = useState(search.registered === true);
  const [showVerified] = useState(search.verified === true);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const redirectPath: RoutePath = search.redirect;

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
      await login({ email: values.email.trim(), password: values.password });
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
        body: JSON.stringify({ email: values.email.trim() }),
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
    <Box style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Left: Image Panel */}
      <Box
        visibleFrom="lg"
        style={{
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url(/login-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
        }}
      >
        {/* Dark overlay */}
        <Box style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />

        {/* Top-left branding */}
        <Group
          gap="xs"
          style={{
            position: 'absolute', top: 40, left: 40, zIndex: 1,
          }}
        >
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconSparkles size={18} color="#fff" />
          </Box>
          <Text fw={700} fz="lg" c="white" style={{ letterSpacing: '-0.3px' }}>
            Beautify Baltics
          </Text>
        </Group>

        {/* Bottom quote */}
        <Box style={{
          position: 'absolute', bottom: 48, left: 40, right: 40, zIndex: 1,
        }}
        >
          <Text
            fz={32}
            c="white"
            lh={1.3}
            mb="xs"
            style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}
          >
            &ldquo;Redefining beauty standards in the Baltic region.&rdquo;
          </Text>
          <Text fz="xs" c="white" fw={500} style={{ opacity: 0.8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Premium Aesthetics &amp; Wellness
          </Text>
        </Box>
      </Box>

      {/* Right: Form Panel */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem',
          background: '#fff',
        }}
      >
        {/* Mobile branding (visible only on small screens) */}
        <Group gap="xs" mb="xl" hiddenFrom="lg" style={{ alignSelf: 'flex-start' }}>
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--mantine-color-brand-5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconSparkles size={18} color="#fff" />
          </Box>
          <Text fw={700} fz="lg" c="dark">
            Beautify Baltics
          </Text>
        </Group>

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
                    <TextInput
                      label="Email Address"
                      placeholder="name@example.com"
                      type="email"
                      size="md"
                      radius="md"
                      {...resetForm.getInputProps('email')}
                    />
                    <Button
                      type="submit"
                      size="md"
                      radius="md"
                      loading={submitting}
                      color="brand"
                      fullWidth
                    >
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
                  Please enter your details to access your professional account.
                </Text>
              </Stack>

              {showVerified ? (
                <Alert color="teal" title="Email verified" variant="light" mb="lg">
                  Your email has been verified. You can now sign in.
                </Alert>
              ) : null}

              {showRegistered ? (
                <Alert color="teal" title="Registration successful" variant="light" mb="lg">
                  Please check your inbox to verify your email before signing in.
                </Alert>
              ) : null}

              {emailNotVerified ? (
                <Alert color="yellow" title="Email not verified" variant="light" mb="lg">
                  Please check your inbox and verify your email before signing in.
                </Alert>
              ) : null}

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
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
                        Forgot your password?
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
                    rightSection={<span style={{ fontSize: 16 }}>→</span>}
                    fullWidth
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>

              <Text c="dimmed" fz="sm" ta="center" mt="xl">
                Don&apos;t have an account yet?
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
  );
}
