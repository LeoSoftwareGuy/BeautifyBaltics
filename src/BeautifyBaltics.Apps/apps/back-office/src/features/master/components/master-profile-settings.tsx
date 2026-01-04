import { useState } from 'react';
import {
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { IconDeviceFloppy, IconPhotoUp } from '@tabler/icons-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string;
  experience: string;
  address: string;
  city: string;
}

function MasterProfileSettings() {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    bio: 'Professional barber with over 10 years of experience specializing in classic and modern haircuts.',
    specialties: 'Haircuts, Beard Trims, Hot Towel Shaves',
    experience: '10 years',
    address: '123 Main Street',
    city: 'New York',
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving profile:', profile);
  };

  return (
    <Stack gap="lg">
      <Card withBorder radius="md">
        <Stack gap="xs">
          <div>
            <Title order={3}>Profile Photo</Title>
            <Text c="dimmed" fz="sm">Upload a professional photo for your profile</Text>
          </div>
          <Group gap="lg">
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'var(--mantine-color-gray-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--mantine-color-gray-6)',
              }}
            >
              {profile.firstName[0]}
              {profile.lastName[0]}
            </div>
            <Button variant="default" leftSection={<IconPhotoUp size={16} />}>
              Upload Photo
            </Button>
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
            <Stack gap={4}>
              <Text fz="sm" fw={500}>First name</Text>
              <TextInput value={profile.firstName} onChange={(e) => handleChange('firstName', e.currentTarget.value)} />
            </Stack>
            <Stack gap={4}>
              <Text fz="sm" fw={500}>Last name</Text>
              <TextInput value={profile.lastName} onChange={(e) => handleChange('lastName', e.currentTarget.value)} />
            </Stack>
            <Stack gap={4}>
              <Text fz="sm" fw={500}>Email</Text>
              <TextInput type="email" value={profile.email} onChange={(e) => handleChange('email', e.currentTarget.value)} />
            </Stack>
            <Stack gap={4}>
              <Text fz="sm" fw={500}>Phone number</Text>
              <TextInput value={profile.phone} onChange={(e) => handleChange('phone', e.currentTarget.value)} />
            </Stack>
          </SimpleGrid>
        </Stack>
      </Card>

      <Card withBorder radius="md">
        <Stack gap="xs">
          <div>
            <Title order={4}>Professional Information</Title>
            <Text c="dimmed" fz="sm">Tell clients about your expertise</Text>
          </div>
          <Stack gap="md">
            <Stack gap={4}>
              <Text fz="sm" fw={500}>Bio</Text>
              <Textarea
                rows={4}
                placeholder="Tell clients about yourself and your experience..."
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.currentTarget.value)}
              />
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Stack gap={4}>
                <Text fz="sm" fw={500}>Specialties</Text>
                <TextInput
                  placeholder="e.g., Haircuts, Coloring, Styling"
                  value={profile.specialties}
                  onChange={(e) => handleChange('specialties', e.currentTarget.value)}
                />
              </Stack>
              <Stack gap={4}>
                <Text fz="sm" fw={500}>Years of experience</Text>
                <TextInput
                  placeholder="e.g., 5 years"
                  value={profile.experience}
                  onChange={(e) => handleChange('experience', e.currentTarget.value)}
                />
              </Stack>
            </SimpleGrid>
          </Stack>
        </Stack>
      </Card>

      <Card withBorder radius="md">
        <Stack gap="xs">
          <div>
            <Title order={4}>Location</Title>
            <Text c="dimmed" fz="sm">Where clients can find you</Text>
          </div>
          <Stack gap="md" mt="sm">
            <Stack gap={4}>
              <Text fz="sm" fw={500}>Address</Text>
              <TextInput placeholder="Street address" value={profile.address} onChange={(e) => handleChange('address', e.currentTarget.value)} />
            </Stack>
            <Stack gap={4}>
              <Text fz="sm" fw={500}>City</Text>
              <TextInput placeholder="City" value={profile.city} onChange={(e) => handleChange('city', e.currentTarget.value)} />
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Group justify="flex-end">
        <Button size="md" leftSection={<IconDeviceFloppy size={16} />} onClick={handleSave}>
          Save changes
        </Button>
      </Group>
    </Stack>
  );
}

export default MasterProfileSettings;
