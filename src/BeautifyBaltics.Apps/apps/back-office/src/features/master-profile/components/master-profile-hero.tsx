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

import type { MasterProfile } from '../data';

type ProfileHeroProps = {
  profile: MasterProfile;
};

function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image
          src={profile.image}
          radius="xl"
          alt={profile.name}
          mah={420}
          fit="cover"
          fallbackSrc="https://placehold.co/800x600?text=Master"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="lg">
          <Group gap="sm">
            <Badge variant="light">{profile.category}</Badge>
            <Badge variant="outline">{profile.priceLabel}</Badge>
          </Group>
          <Title order={1} fw={800} size="clamp(28px, 4vw, 48px)">
            {profile.name}
          </Title>
          <Group gap="md" c="dimmed">
            <Group gap={6}>
              <Star size={18} fill="currentColor" />
              <Text fw={600} c="var(--mantine-color-text)">
                {profile.rating.toFixed(1)}
              </Text>
              <Text>
                (
                {profile.reviews}
                {' '}
                reviews)
              </Text>
            </Group>
          </Group>
          <Text c="dimmed" lh={1.7}>
            {profile.bio}
          </Text>

          <Card withBorder radius="lg">
            <Stack gap="sm">
              <Group gap="sm">
                <MapPin size={18} />
                <Text>{profile.address}</Text>
              </Group>
              <Group gap="sm">
                <Phone size={18} />
                <ButtonLink href={`tel:${profile.phone}`} label={profile.phone} />
              </Group>
              <Group gap="sm">
                <Mail size={18} />
                <ButtonLink href={`mailto:${profile.email}`} label={profile.email} />
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

type ButtonLinkProps = {
  href: string;
  label: string;
};

function ButtonLink({ href, label }: ButtonLinkProps) {
  return (
    <Text
      component="a"
      href={href}
      variant="link"
      c="grape.6"
      style={{ textDecoration: 'none', fontWeight: 600 }}
    >
      {label}
    </Text>
  );
}

export default ProfileHero;
