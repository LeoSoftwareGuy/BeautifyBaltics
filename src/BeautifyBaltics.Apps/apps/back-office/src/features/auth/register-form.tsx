import { useState } from 'react';
import {
  Button,
  Paper,
  PasswordInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

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
        miw={360}
        component="form"
        onSubmit={handleSubmit}
      >
        <Stack gap="lg">
          <div>
            <Title order={3}>Create an account</Title>
            <Text c="dimmed" fz="sm">
              Register to access Beautify Baltics.
            </Text>
          </div>

          <Stack gap="md">
            <TextInput
              label="First name"
              placeholder="John"
              withAsterisk
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Last name"
              placeholder="Doe"
              withAsterisk
              {...form.getInputProps('lastName')}
            />
            <TextInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              withAsterisk
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              withAsterisk
              {...form.getInputProps('password')}
            />
            <TextInput
              label="Phone number"
              type="tel"
              placeholder="+123456789"
              withAsterisk
              {...form.getInputProps('phoneNumber')}
            />
          </Stack>

          <Radio.Group
            label="Account type"
            description="Choose how you want to use Beautify Baltics"
            {...form.getInputProps('role')}
          >
            <Stack gap={10} mt="sm">
              <Radio value="client" label="Client" />
              <Radio value="master" label="Master" />
            </Stack>
          </Radio.Group>

          <Button type="submit" loading={submitting}>
            Create account
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
