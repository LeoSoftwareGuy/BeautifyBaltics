import { useEffect, useMemo } from 'react';
import {
  Badge,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  Mail, MapPin, Phone, Star,
} from 'lucide-react';

import type { GetMasterByIdResponse } from '@/state/endpoints/api.schemas';
import { useGetMasterProfileImage } from '@/state/endpoints/masters';

type ProfileHeroProps = {
  master: GetMasterByIdResponse;
};

function MasterProfileHero({ master }: ProfileHeroProps) {
  const { data: profileImage } = useGetMasterProfileImage(master.id ?? '', {
    query: { enabled: !!master.id },
  });
  const fullName = [master.firstName, master.lastName].filter(Boolean).join(' ').trim() || 'Unnamed master';
  const ratingValue = typeof master.rating === 'number' ? master.rating.toFixed(1) : null;

  const profileImageUrl = useMemo(() => {
    if (!profileImage) return null;
    return URL.createObjectURL(profileImage);
  }, [profileImage]);

  useEffect(() => () => {
    if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
  }, [profileImageUrl]);

  return (
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image
          src={profileImageUrl}
          radius="xl"
          alt={fullName}
          mah={420}
          fit="cover"
          fallbackSrc="https://placehold.co/800x600?text=Master"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="lg">
          <Group gap="sm">
            {master.gender ? <Badge variant="light">{master.gender}</Badge> : null}
            {master.city ? <Badge variant="outline">{master.city}</Badge> : null}
          </Group>
          <Title order={1} fw={800} size="clamp(28px, 4vw, 48px)">
            {fullName}
          </Title>
          <Group gap="md" c="dimmed">
            <Group gap={6}>
              <Star size={18} fill="currentColor" />
              <Text fw={600} c="var(--mantine-color-text)">
                {ratingValue ?? 'New'}
              </Text>
              <Text>
                (
                {ratingValue ? 'Rating' : 'Awaiting reviews'}
                )
              </Text>
            </Group>
          </Group>
          <Text c="dimmed" lh={1.7}>
            This master has not provided a bio yet. Check back later for more details.
          </Text>

          <Card withBorder radius="lg">
            <Stack gap="sm">
              <Group gap="sm">
                <MapPin size={18} />
                <Text>{master.city ?? 'Location not provided'}</Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <Phone size={18} />
                <Text
                  variant="link"
                  c="grape.6"
                  style={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  {master.phoneNumber ?? 'Phone not provided'}
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <Mail size={18} />
                <Text
                  variant="link"
                  c="grape.6"
                  style={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  {master.email ?? 'Email not provided'}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default MasterProfileHero;
