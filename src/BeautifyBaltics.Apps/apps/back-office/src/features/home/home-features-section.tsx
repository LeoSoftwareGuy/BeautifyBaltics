import { useState } from 'react';
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
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Book appointments instantly with real-time availability updates.',
  },
  {
    icon: Image,
    title: 'Portfolio Showcase',
    description: 'Browse master portfolios to find the perfect match for your style.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Read authentic reviews from real customers to make informed decisions.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Safe and secure booking with verified professionals only.',
  },
] as const;

function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
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
          {feature.title}
        </Text>
        <Text c="dimmed">{feature.description}</Text>
      </Stack>
    </Card>
  );
}

function FeaturesSection() {
  return (
    <Box component="section" bg="gray.0" py={{ base: 64, md: 96 }}>
      <Container size="lg">
        <Stack gap="sm" ta="center" align="center" mb={{ base: 40, md: 64 }}>
          <Title order={2} fw={800} size="clamp(32px, 4vw, 48px)">
            Why Choose Beautify Baltics
          </Title>
          <Text size="lg" maw={600} c="dimmed">
            Everything you need to discover and book the best beauty professionals in your area.
          </Text>
        </Stack>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
