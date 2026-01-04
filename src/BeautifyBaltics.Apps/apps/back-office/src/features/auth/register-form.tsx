import { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconScissors, IconUser } from '@tabler/icons-react';

import { supabase } from '@/integrations/supabase/client';

import { provisionUserProfile } from './provision-user';
import { savePendingProvision } from './provisioning-storage';

type RoleOption = 'client' | 'master';

type RegisterFormProps = {
  onRequireEmailVerification?: () => void;
  onRegistrationComplete?: () => void;
};

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: RoleOption;
};

export function RegisterForm({ onRequireEmailVerification, onRegistrationComplete }: RegisterFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'client',
    },
    validate: {
      firstName: (value) => (value.trim().length >= 3 ? null : 'First name must be at least 3 characters'),
      lastName: (value) => (value.trim().length >= 3 ? null : 'Last name must be at least 3 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      phoneNumber: (value) => (value.trim().length ? null : 'Phone number is required'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            role: values.role,
          },
        },
      });

      if (error) {
        throw error;
      }

      const currentSession = data.session ?? (await supabase.auth.getSession()).data.session;
      if (!currentSession) {
        notifications.show({
          title: 'Check your inbox',
          message: 'Please confirm your email before signing in.',
          color: 'yellow',
        });
        savePendingProvision({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          role: values.role,
        });
        onRequireEmailVerification?.();
        return;
      }

      await provisionUserProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: values.role,
      });

      notifications.show({
        title: 'Account created',
        message: 'Welcome to Beautify Baltics!',
        color: 'teal',
      });

      onRegistrationComplete?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      notifications.show({
        title: 'Registration failed',
        message,
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Stack align="center" justify="center" mih="calc(100vh - 120px)" mt="xl">
      <Paper
        withBorder
        p="xl"
        radius="lg"
        w={500}
        component="form"
        onSubmit={handleSubmit}
      >
        <Stack gap="lg">
          <Stack gap="xs" align="center">
            <Title order={2}>Create an account</Title>
            <Text c="dimmed" size="sm">
              Register to access Beautify Baltics.
            </Text>
          </Stack>

          <Stack gap="md">
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                First name
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                placeholder="John"
                radius="md"
                {...form.getInputProps('firstName')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Last name
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                placeholder="Doe"
                radius="md"
                {...form.getInputProps('lastName')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Email address
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                type="email"
                placeholder="you@example.com"
                radius="md"
                {...form.getInputProps('email')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Password
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <PasswordInput
                placeholder="••••••••"
                radius="md"
                {...form.getInputProps('password')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Phone number
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                type="tel"
                placeholder="+123456789"
                radius="md"
                {...form.getInputProps('phoneNumber')}
              />
            </Stack>
          </Stack>

          <Stack gap="sm">
            <Text size="sm" fw={500}>
              Account type
            </Text>
            <Text size="xs" c="dimmed">
              Choose how you want to use Beautify Baltics
            </Text>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <UnstyledButton
                  onClick={() => form.setFieldValue('role', 'client')}
                  style={{
                    width: '100%',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: form.values.role === 'client' ? 'var(--mantine-color-pink-6)' : 'var(--mantine-color-gray-3)',
                    backgroundColor: form.values.role === 'client' ? 'var(--mantine-color-pink-6)' : 'transparent',
                    color: form.values.role === 'client' ? 'white' : 'var(--mantine-color-gray-7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Stack gap="xs" align="center">
                    <IconUser size={24} stroke={2} />
                    <Text fw={600} size="sm">Client</Text>
                  </Stack>
                </UnstyledButton>
              </Grid.Col>
              <Grid.Col span={6}>
                <UnstyledButton
                  onClick={() => form.setFieldValue('role', 'master')}
                  style={{
                    width: '100%',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: form.values.role === 'master' ? 'var(--mantine-color-pink-6)' : 'var(--mantine-color-gray-3)',
                    backgroundColor: form.values.role === 'master' ? 'var(--mantine-color-pink-6)' : 'transparent',
                    color: form.values.role === 'master' ? 'white' : 'var(--mantine-color-gray-7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Stack gap="xs" align="center">
                    <IconScissors size={24} stroke={2} />
                    <Text fw={600} size="sm">Master</Text>
                  </Stack>
                </UnstyledButton>
              </Grid.Col>
            </Grid>
          </Stack>

          <Button type="submit" loading={submitting} size="md" color="pink">
            Create account
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
