import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSparkles } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

import { AnchorLink } from '@/components/navigation';
import type { FileRouteTypes } from '@/routeTree.gen';

type RoutePath = FileRouteTypes['to'];

type ResetPasswordSearch = {
  token?: string;
};

export const Route = createFileRoute('/reset-password/')({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: ResetPasswordView,
});

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPasswordView() {
  const search = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    initialValues: { newPassword: '', confirmPassword: '' },
    validate: {
      newPassword: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) => (value === values.newPassword ? null : 'Passwords do not match'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    if (!search.token) {
      notifications.show({ title: 'Invalid link', message: 'Reset token is missing.', color: 'red' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: search.token, newPassword: values.newPassword }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Password reset failed. The link may have expired.');
      }

      setSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed. Please try again.';
      notifications.show({ title: 'Reset failed', message, color: 'red' });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
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
        <Group gap="xs" mb="xl" style={{ alignSelf: 'flex-start' }}>
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
          <Stack gap="xs" mb="xl">
            <Title order={1} style={{ fontFamily: '"Playfair Display", serif' }}>
              Set new password
            </Title>
            <Text c="dimmed" fz="sm">
              Enter your new password below.
            </Text>
          </Stack>

          {success ? (
            <>
              <Alert color="teal" title="Password updated" variant="light" mb="lg">
                Your password has been reset successfully. You can now sign in.
              </Alert>
              <Text c="dimmed" fz="sm" ta="center" mt="xl">
                <AnchorLink to="/login" search={() => ({ redirect: '/home' as RoutePath })}>
                  Go to sign in
                </AnchorLink>
              </Text>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <PasswordInput
                  label="New password"
                  placeholder="••••••••"
                  size="md"
                  radius="md"
                  {...form.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="Confirm password"
                  placeholder="••••••••"
                  size="md"
                  radius="md"
                  {...form.getInputProps('confirmPassword')}
                />
                <Button
                  type="submit"
                  size="md"
                  radius="md"
                  loading={submitting}
                  color="brand"
                  fullWidth
                >
                  Reset password
                </Button>
              </Stack>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
}
