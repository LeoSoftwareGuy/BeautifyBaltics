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

import { Gender, UpdateMasterProfileRequest } from '@/state/endpoints/api.schemas';
import { useGetMasterById, useGetMasterProfileImage, useUpdateMasterProfile, useUploadMasterProfileImage } from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

const validate = {
  firstName: hasLength({ min: 1, max: 128 }, 'First name is required (1-128 characters)'),
  lastName: hasLength({ min: 1, max: 128 }, 'Last name is required (1-128 characters)'),
  email: hasLength({ min: 1 }, 'Email is required'),
  phoneNumber: hasLength({ min: 1, max: 32 }, 'Phone number is required'),
};

function MasterProfileSettings() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';

  const {
    data: masterData,
    isLoading: isMasterLoading,
    isError: isMasterError,
    dataUpdatedAt,
    refetch,
  } = useGetMasterById(masterId, { id: masterId }, {
    query: { enabled: !!masterId },
  });

  const { data: profileImageBlob, dataUpdatedAt: imageUpdatedAt, refetch: refetchImage } = useGetMasterProfileImage(masterId, {
    query: { enabled: !!masterId && !!masterData?.profileImage },
  });

  const profileImageUrl = useMemo(() => {
    if (!profileImageBlob) return null;
    return URL.createObjectURL(profileImageBlob);
  }, [profileImageBlob, imageUpdatedAt]);

  useEffect(() => {
    return () => {
      if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    };
  }, [profileImageUrl]);

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
          title: 'Profile updated',
          message: 'Your profile has been updated successfully.',
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Update failed',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadMasterProfileImage({
    mutation: {
      onSuccess: async () => {
        await refetch();
        await refetchImage();
        notifications.show({
          title: 'Photo uploaded',
          message: 'Your profile photo has been updated successfully.',
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Upload failed',
          message: error.detail,
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

  const isLoading = isUserLoading || isMasterLoading;

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="lg" />
        <Text c="dimmed">Loading profile...</Text>
      </Stack>
    );
  }

  if (isMasterError || !masterId) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        Failed to load profile data. Please try again later.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Card withBorder radius="md">
          <Stack gap="xs">
            <div>
              <Title order={3}>Profile Photo</Title>
              <Text c="dimmed" fz="sm">Upload a professional photo for your profile</Text>
            </div>
            <Group gap="lg">
              <Avatar
                size={96}
                radius="xl"
                src={profileImageUrl}
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
                    Upload Photo
                  </Button>
                )}
              </FileButton>
            </Group>
          </Stack>
        </Card>

        <Card withBorder radius="md">
          <Stack gap="xs">
            <div>
              <Title order={4}>Personal Information</Title>
              <Text c="dimmed" fz="sm">Update your personal details</Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                withAsterisk
                label="First name"
                placeholder="Enter first name"
                key={form.key('firstName')}
                {...form.getInputProps('firstName')}
              />
              <TextInput
                withAsterisk
                label="Last name"
                placeholder="Enter last name"
                key={form.key('lastName')}
                {...form.getInputProps('lastName')}
              />
              <TextInput
                withAsterisk
                type="email"
                label="Email"
                placeholder="Enter email"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <TextInput
                withAsterisk
                label="Phone number"
                placeholder="Enter phone number"
                key={form.key('phoneNumber')}
                {...form.getInputProps('phoneNumber')}
              />
              <NumberInput
                label="Age"
                placeholder="Enter age"
                min={18}
                max={120}
                key={form.key('age')}
                {...form.getInputProps('age')}
              />
              <Select
                label="Gender"
                placeholder="Select gender"
                data={[
                  { value: Gender.Male, label: 'Male' },
                  { value: Gender.Female, label: 'Female' },
                  { value: Gender.Other, label: 'Other' },
                ]}
                clearable
                key={form.key('gender')}
                {...form.getInputProps('gender')}
              />
            </SimpleGrid>
            <Textarea
              label="About me"
              placeholder="Tell clients about yourself, your experience, and specialties..."
              minRows={4}
              maxLength={1000}
              key={form.key('description')}
              {...form.getInputProps('description')}
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
            Save changes
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default MasterProfileSettings;
