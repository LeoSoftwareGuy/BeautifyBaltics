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

type ProfileHeroProps = {
  master: GetMasterByIdResponse;
};

function ProfileHero({ master }: ProfileHeroProps) {
  const fullName = [master.firstName, master.lastName].filter(Boolean).join(' ').trim() || 'Unnamed master';
  const ratingValue = typeof master.rating === 'number' ? master.rating.toFixed(1) : null;
  const phone = master.phoneNumber ?? undefined;
  const email = master.email ?? undefined;
  const city = master.city ?? 'Location not provided';
  const heroImage = undefined;

  return (
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image
          src={heroImage}
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
                <Text>{city}</Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <Phone size={18} />
                <ButtonLink
                  href={phone ? `tel:${phone}` : undefined}
                  label={phone ?? 'Phone not provided'}
                />
              </Group>
              <Group gap="sm" wrap="nowrap">
                <Mail size={18} />
                <ButtonLink
                  href={email ? `mailto:${email}` : undefined}
                  label={email ?? 'Email not provided'}
                />
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

type ButtonLinkProps = {
  href?: string;
  label: string;
};

function ButtonLink({ href, label }: ButtonLinkProps) {
  const textProps = href
    ? { component: 'a' as const, href }
    : { component: 'span' as const };

  return (
    <Text
      {...textProps}
      variant="link"
      c="grape.6"
      style={{ textDecoration: 'none', fontWeight: 600 }}
    >
      {label}
    </Text>
  );
}

export default ProfileHero;
