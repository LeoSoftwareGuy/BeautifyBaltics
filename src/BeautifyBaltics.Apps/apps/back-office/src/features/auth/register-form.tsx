import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
      firstName: (value) => (value.trim().length >= 3 ? null : t('auth.shared.validation.firstNameMin')),
      lastName: (value) => (value.trim().length >= 3 ? null : t('auth.shared.validation.lastNameMin')),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('auth.shared.validation.emailInvalid')),
      password: (value) => (value.length >= 6 ? null : t('auth.shared.validation.passwordMin')),
      phoneNumber: (value) => (value.trim().length ? null : t('auth.shared.validation.phoneRequired')),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitting(true);
    try {
      const trimmed = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phoneNumber.trim(),
        role: values.role,
      };

      const { data, error } = await supabase.auth.signUp({
        email: trimmed.email,
        password: trimmed.password,
        options: {
          data: {
            firstName: trimmed.firstName,
            lastName: trimmed.lastName,
            phoneNumber: trimmed.phoneNumber,
            role: trimmed.role,
          },
        },
      });

      if (error) {
        throw error;
      }

      const currentSession = data.session ?? (await supabase.auth.getSession()).data.session;
      if (!currentSession) {
        notifications.show({
          title: t('auth.register.notifications.checkInboxTitle'),
          message: t('auth.register.notifications.checkInboxMessage'),
          color: 'yellow',
        });
        onRequireEmailVerification?.();
        return;
      }

      notifications.show({
        title: t('auth.register.notifications.successTitle'),
        message: t('auth.register.notifications.successMessage'),
        color: 'teal',
      });

      onRegistrationComplete?.();
    } catch (error) {
      const fallbackMessage = t('auth.register.notifications.failureMessage');
      const message = error instanceof Error ? error.message : fallbackMessage;
      notifications.show({
        title: t('auth.register.notifications.failureTitle'),
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
            <Title order={2}>{t('auth.register.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('auth.register.subtitle')}
            </Text>
          </Stack>

          <Stack gap="md">
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                {t('auth.shared.labels.firstName')}
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                placeholder={t('auth.shared.placeholders.firstName')}
                radius="md"
                {...form.getInputProps('firstName')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                {t('auth.shared.labels.lastName')}
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                placeholder={t('auth.shared.placeholders.lastName')}
                radius="md"
                {...form.getInputProps('lastName')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                {t('auth.shared.labels.email')}
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                type="email"
                placeholder={t('auth.shared.placeholders.email')}
                radius="md"
                {...form.getInputProps('email')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                {t('auth.shared.labels.password')}
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <PasswordInput
                placeholder={t('auth.shared.placeholders.password')}
                radius="md"
                {...form.getInputProps('password')}
              />
            </Stack>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                {t('auth.shared.labels.phoneNumber')}
                {' '}
                <Text component="span" c="red">*</Text>
              </Text>
              <TextInput
                type="tel"
                placeholder={t('auth.shared.placeholders.phoneNumber')}
                radius="md"
                {...form.getInputProps('phoneNumber')}
              />
            </Stack>
          </Stack>

          <Stack gap="sm">
            <Text size="sm" fw={500}>
              {t('auth.register.accountTypeLabel')}
            </Text>
            <Text size="xs" c="dimmed">
              {t('auth.register.accountTypeHint')}
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
                    <Text fw={600} size="sm">{t('auth.register.roleClient')}</Text>
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
                    <Text fw={600} size="sm">{t('auth.register.roleMaster')}</Text>
                  </Stack>
                </UnstyledButton>
              </Grid.Col>
            </Grid>
          </Stack>

          <Button type="submit" loading={submitting} size="md" color="pink">
            {t('auth.register.submitButton')}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
