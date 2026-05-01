import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Grid,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconScissors, IconUser } from '@tabler/icons-react';

type RoleOption = 'client' | 'master';

type RegisterFormProps = {
  onRequireEmailVerification?: () => void;
  onRegistrationComplete?: () => void;
  defaultRole?: RoleOption;
};

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: RoleOption;
};

export function RegisterForm({ onRequireEmailVerification, defaultRole = 'client' }: RegisterFormProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 75em)');

  const form = useForm<RegisterFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: defaultRole,
    },
    validate: {
      firstName: (value) => (value.trim().length >= 3 ? null : 'First name must be at least 3 characters'),
      lastName: (value) => (value.trim().length >= 3 ? null : 'Last name must be at least 3 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Enter a valid email address'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      phoneNumber: (value) => (value.trim().length ? null : 'Phone number is required'),
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

      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(trimmed),
      });

      if (response.status === 409 || response.status === 400) {
        const body = await response.json().catch(() => ({}));
        const detail: string = body?.detail ?? '';
        if (detail.toLowerCase().includes('phone')) {
          form.setFieldError('phoneNumber', 'An account with this phone number already exists.');
        } else {
          form.setFieldError('email', 'An account with this email already exists for the selected account type.');
        }
        return;
      }

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      // Registration always requires email verification
      onRequireEmailVerification?.();
    } catch (error) {
      const fallbackMessage = 'Registration failed. Please try again.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      notifications.show({
        title: 'Registration failed',
        message,
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  });

  useEffect(() => {
    if (form.values.role !== defaultRole) {
      form.setFieldValue('role', defaultRole);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultRole]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={2} style={{ fontFamily: '"Playfair Display", serif' }}>{t('auth.register.title')}</Title>
          <Text c="dimmed" size="sm">
            {t('auth.register.subtitle')}
          </Text>
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
        <Stack gap="md">
          <Grid gutter="md">
            <Grid.Col span={isDesktop ? 6 : 12}>
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
            </Grid.Col>
            <Grid.Col span={isDesktop ? 6 : 12}>
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
            </Grid.Col>
          </Grid>
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
        <Button type="submit" loading={submitting} size="md" radius="md" color="brand" fullWidth>
          {t('auth.register.submitButton')}
        </Button>
      </Stack>
    </form>
  );
}
