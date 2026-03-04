import { useTranslation } from 'react-i18next';
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

import { ClientBookingLocationMap } from '@/features/client/client-dashboard/client-booking-location-map';
import type { GetMasterByIdResponse } from '@/state/endpoints/api.schemas';

type ProfileHeroProps = {
  master: GetMasterByIdResponse;
};

function MasterProfileHero({ master }: ProfileHeroProps) {
  const { t } = useTranslation();
  const fullName = [master.firstName, master.lastName].filter(Boolean).join(' ').trim() || t('masterProfile.hero.unnamed');
  const ratingValue = typeof master.rating === 'number' ? master.rating.toFixed(1) : null;
  const addressSegments = [
    master.addressLine1,
    master.addressLine2,
    master.city,
    master.postalCode,
    master.country,
  ].filter((segment): segment is string => Boolean(segment && segment.trim().length));
  const formattedAddress = addressSegments.join(', ') || master.city || t('masterProfile.hero.locationFallback');
  const hasCoordinates = typeof master.latitude === 'number' && typeof master.longitude === 'number';

  return (
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Image
          src={master.profileImageUrl}
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
                {ratingValue ?? t('masterProfile.hero.new')}
              </Text>
              <Text>
                (
                {ratingValue ? t('masterProfile.hero.rating') : t('masterProfile.hero.awaitingReviews')}
                )
              </Text>
            </Group>
          </Group>
          <Text c="dimmed" lh={1.7}>
            {master.description ?? t('masterProfile.hero.noBio')}
          </Text>

          <Card withBorder radius="lg">
            <Stack gap="sm">
              <Stack gap={2}>
                <Text fw={600} size="sm">{t('masterProfile.hero.addressLabel')}</Text>
                <Group gap="sm" wrap="nowrap">
                  <MapPin size={18} />
                  <Text>{formattedAddress}</Text>
                </Group>
              </Stack>
              {hasCoordinates && (
                <Stack gap={4}>
                  <Text fw={600} size="sm">{t('masterProfile.hero.mapLabel')}</Text>
                  <ClientBookingLocationMap
                    latitude={master.latitude ?? undefined}
                    longitude={master.longitude ?? undefined}
                    height={180}
                  />
                </Stack>
              )}
              <Group gap="sm" wrap="nowrap">
                <Phone size={18} />
                <Text
                  variant="link"
                  c="grape.6"
                  style={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  {master.phoneNumber ?? t('masterProfile.hero.phoneFallback')}
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <Mail size={18} />
                <Text
                  variant="link"
                  c="grape.6"
                  style={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  {master.email ?? t('masterProfile.hero.emailFallback')}
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
