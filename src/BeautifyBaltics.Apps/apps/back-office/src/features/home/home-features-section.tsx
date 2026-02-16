import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  Calendar, Image, Shield, Star,
} from 'lucide-react';

const FEATURES = [
  { icon: Calendar, key: 'booking' },
  { icon: Image, key: 'portfolio' },
  { icon: Star, key: 'reviews' },
  { icon: Shield, key: 'security' },
] as const;

function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      p="xl"
      radius="lg"
      shadow="sm"
      withBorder
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
        boxShadow: isHovered ? 'var(--mantine-shadow-md)' : 'var(--mantine-shadow-sm)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack gap="sm">
        <Box
          w={48}
          h={48}
          bg="grape.0"
          c="grape.6"
          style={{
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <feature.icon size={20} />
        </Box>
        <Text fw={600} size="lg">
          {t(`home.features.items.${feature.key}.title`)}
        </Text>
        <Text c="dimmed">{t(`home.features.items.${feature.key}.description`)}</Text>
      </Stack>
    </Card>
  );
}

function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <Box
      component="section"
      bg="gray.0"
      py={{ base: 48, md: 72 }}
      mt={{ base: -24, md: -40 }}
    >
      <Container size="lg">
        <Stack gap="sm" ta="center" align="center" mb={{ base: 40, md: 64 }}>
          <Title order={2} fw={800} size="clamp(32px, 4vw, 48px)">
            {t('home.features.title')}
          </Title>
          <Text size="lg" maw={600} c="dimmed">
            {t('home.features.subtitle')}
          </Text>
        </Stack>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.key} feature={feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
