import { useEffect, useMemo } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  FileButton,
  Group,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconDeviceFloppy, IconPhotoUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { LocationData } from '@/features/map';
import { LocationPicker } from '@/features/map';
import { Gender, UpdateMasterProfileRequest } from '@/state/endpoints/api.schemas';
import {
  useGetMasterById, useUpdateMasterProfile, useUploadMasterProfileImage,
} from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

function MasterProfileSettings() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';
  const { t } = useTranslation();

  const {
    data: masterData,
    isLoading: isMasterLoading,
    isError: isMasterError,
    dataUpdatedAt,
    refetch,
  } = useGetMasterById(masterId, { id: masterId }, {
    query: { enabled: !!masterId },
  });

  const validate = useMemo(
    () => ({
      firstName: hasLength({ min: 1, max: 128 }, t('master.settings.profile.validation.firstName')),
      lastName: hasLength({ min: 1, max: 128 }, t('master.settings.profile.validation.lastName')),
      email: hasLength({ min: 1 }, t('master.settings.profile.validation.email')),
      phoneNumber: hasLength({ min: 1, max: 32 }, t('master.settings.profile.validation.phone')),
    }),
    [t],
  );

  const form = useForm<UpdateMasterProfileRequest>({
    mode: 'uncontrolled',
    initialValues: {
      masterId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      age: null,
      gender: undefined,
      description: null,
      latitude: null,
      longitude: null,
      city: null,
      country: null,
      addressLine1: null,
      addressLine2: null,
      postalCode: null,
    },
    validate,
  });

  useEffect(() => {
    if (masterData) {
      form.setValues({
        masterId,
        firstName: masterData.firstName ?? '',
        lastName: masterData.lastName ?? '',
        email: masterData.email ?? '',
        phoneNumber: masterData.phoneNumber ?? '',
        age: masterData.age ?? null,
        gender: masterData.gender,
        description: masterData.description ?? null,
        latitude: masterData.latitude ?? null,
        longitude: masterData.longitude ?? null,
        city: masterData.city ?? null,
        country: masterData.country ?? null,
        addressLine1: masterData.addressLine1 ?? null,
        addressLine2: masterData.addressLine2 ?? null,
        postalCode: masterData.postalCode ?? null,
      });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterData, masterId, dataUpdatedAt]);

  const { mutateAsync, isPending } = useUpdateMasterProfile({
    mutation: {
      onSuccess: async () => {
        await refetch();
        notifications.show({
          title: t('master.settings.profile.notifications.updateSuccessTitle'),
          message: t('master.settings.profile.notifications.updateSuccessMessage'),
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: t('master.settings.profile.notifications.updateErrorTitle'),
          message: error.detail ?? t('master.settings.profile.notifications.updateErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadMasterProfileImage({
    mutation: {
      onSuccess: async () => {
        await refetch();
        notifications.show({
          title: t('master.settings.profile.notifications.photoSuccessTitle'),
          message: t('master.settings.profile.notifications.photoSuccessMessage'),
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: t('master.settings.profile.notifications.photoErrorTitle'),
          message: error.detail ?? t('master.settings.profile.notifications.photoErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleFileUpload = async (file: File | null) => {
    if (!file || !masterId) return;
    await uploadImage({
      id: masterId,
      data: {
        masterId,
        files: [file],
      },
    });
  };

  const handleSubmit = form.onSubmit(async (values) => {
    await mutateAsync({
      id: masterId,
      data: values,
    });
  });

  const handleLocationChange = (location: LocationData) => {
    form.setValues({
      latitude: location.latitude,
      longitude: location.longitude,
      city: location.city,
      country: location.country,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2,
      postalCode: location.postalCode,
    });
  };

  const isLoading = isUserLoading || isMasterLoading;

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="lg" />
        <Text c="dimmed">{t('master.settings.profile.loading')}</Text>
      </Stack>
    );
  }

  if (isMasterError || !masterId) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={t('master.settings.profile.error.title')} color="red">
        {t('master.settings.profile.error.message')}
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Card withBorder radius="md">
          <Stack gap="xs">
            <div>
              <Title order={3}>{t('master.settings.profile.photo.title')}</Title>
              <Text c="dimmed" fz="sm">{t('master.settings.profile.photo.subtitle')}</Text>
            </div>
            <Group gap="lg">
              <Avatar
                size={96}
                radius="xl"
                src={masterData?.profileImageUrl}
              >
                {(form.getValues().firstName?.[0] ?? '')}
                {(form.getValues().lastName?.[0] ?? '')}
              </Avatar>
              <FileButton onChange={handleFileUpload} accept="image/png,image/jpeg,image/webp">
                {(props) => (
                  <Button
                    variant="default"
                    leftSection={<IconPhotoUp size={16} />}
                    loading={isUploading}
                    {...props}
                  >
                    {t('master.settings.profile.photo.uploadButton')}
                  </Button>
                )}
              </FileButton>
            </Group>
          </Stack>
        </Card>

        <Card withBorder radius="md">
          <Stack gap="xs">
            <div>
              <Title order={4}>{t('master.settings.profile.personal.title')}</Title>
              <Text c="dimmed" fz="sm">{t('master.settings.profile.personal.subtitle')}</Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                withAsterisk
                label={t('master.settings.profile.form.firstNameLabel')}
                placeholder={t('master.settings.profile.form.firstNamePlaceholder')}
                key={form.key('firstName')}
                {...form.getInputProps('firstName')}
              />
              <TextInput
                withAsterisk
                label={t('master.settings.profile.form.lastNameLabel')}
                placeholder={t('master.settings.profile.form.lastNamePlaceholder')}
                key={form.key('lastName')}
                {...form.getInputProps('lastName')}
              />
              <TextInput
                withAsterisk
                type="email"
                label={t('master.settings.profile.form.emailLabel')}
                placeholder={t('master.settings.profile.form.emailPlaceholder')}
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <TextInput
                withAsterisk
                label={t('master.settings.profile.form.phoneLabel')}
                placeholder={t('master.settings.profile.form.phonePlaceholder')}
                key={form.key('phoneNumber')}
                {...form.getInputProps('phoneNumber')}
              />
              <NumberInput
                label={t('master.settings.profile.form.ageLabel')}
                placeholder={t('master.settings.profile.form.agePlaceholder')}
                min={18}
                max={120}
                key={form.key('age')}
                {...form.getInputProps('age')}
              />
              <Select
                label={t('master.settings.profile.form.genderLabel')}
                placeholder={t('master.settings.profile.form.genderPlaceholder')}
                data={[
                  { value: Gender.Male, label: t('master.settings.profile.form.genderMale') },
                  { value: Gender.Female, label: t('master.settings.profile.form.genderFemale') },
                  { value: Gender.Other, label: t('master.settings.profile.form.genderOther') },
                ]}
                clearable
                key={form.key('gender')}
                {...form.getInputProps('gender')}
              />
            </SimpleGrid>
            <Textarea
              label={t('master.settings.profile.form.aboutLabel')}
              placeholder={t('master.settings.profile.form.aboutPlaceholder')}
              minRows={4}
              maxLength={1000}
              key={form.key('description')}
              {...form.getInputProps('description')}
            />
          </Stack>
        </Card>

        <Card withBorder radius="md">
          <Stack gap="xs">
            <div>
              <Title order={4}>{t('master.settings.profile.location.title')}</Title>
              <Text c="dimmed" fz="sm">{t('master.settings.profile.location.subtitle')}</Text>
            </div>
            <LocationPicker
              value={{
                latitude: form.getValues().latitude ?? undefined,
                longitude: form.getValues().longitude ?? undefined,
                city: form.getValues().city,
                country: form.getValues().country,
                addressLine1: form.getValues().addressLine1,
                addressLine2: form.getValues().addressLine2,
                postalCode: form.getValues().postalCode,
              }}
              onChange={handleLocationChange}
            />
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button
            type="submit"
            leftSection={<IconDeviceFloppy size={16} />}
            loading={isPending}
            disabled={!form.isDirty()}
          >
            {t('master.settings.profile.form.submit')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default MasterProfileSettings;
