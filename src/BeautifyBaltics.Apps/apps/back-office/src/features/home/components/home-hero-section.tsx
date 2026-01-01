import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { MapPin, Search, Sparkles } from 'lucide-react';

const BACKGROUND_PATTERN = "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI0NCwxNjQsMTgwLDAuMSkiLz48L2c+PC9zdmc+')";

const HIGHLIGHTS = ['Verified Professionals', 'Instant Booking', 'Secure Payments'] as const;

function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      pos="relative"
      mih="calc(100vh - 120px)"
      py={{ base: 64, md: 96 }}
      bg="var(--mantine-color-body)"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(250,240,255,0.6))',
      }}
    >
      <Box
        pos="absolute"
        inset={0}
        style={{
          backgroundImage: BACKGROUND_PATTERN,
          opacity: 0.35,
        }}
      />

      <Container size="lg" pos="relative" style={{ zIndex: 1 }}>
        <Stack gap="xl" align="center" ta="center">
          <Badge
            variant="light"
            color="grape"
            radius="xl"
            size="lg"
            leftSection={<Sparkles size={16} />}
          >
            Discover Beauty Professionals Near You
          </Badge>

          <Stack gap="sm" ta="center">
            <Title order={1} fw={800} size="clamp(40px, 6vw, 72px)">
              Book Your Perfect
              {' '}
              <Text component="span" inherit c="grape.6">
                Beauty Experience
              </Text>
            </Title>
            <Text size="lg" maw={640} mx="auto" c="dimmed">
              Connect with talented barbers, tattoo artists, and beauty masters in your city.
              Browse portfolios, check availability, and book appointments seamlessly.
            </Text>
          </Stack>

          <Group gap="md" justify="center" wrap="wrap">
            <Button
              size="lg"
              radius="xl"
              leftSection={<Search size={18} />}
              onClick={() => navigate({ to: '/explore' })}
            >
              Explore Masters
            </Button>
            <Button
              size="lg"
              radius="xl"
              variant="outline"
              leftSection={<MapPin size={18} />}
            >
              View Map
            </Button>
          </Group>

          <Group gap="lg" justify="center" wrap="wrap">
            {HIGHLIGHTS.map((label) => (
              <Group key={label} gap={6}>
                <Box w={8} h={8} bg="grape.5" style={{ borderRadius: 999 }} />
                <Text size="sm" c="dimmed">
                  {label}
                </Text>
              </Group>
            ))}
          </Group>
        </Stack>
      </Container>

      <Box
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        h={120}
        style={{
          background: 'linear-gradient(0deg, rgba(255,255,255,0.9), transparent)',
        }}
      />
    </Box>
  );
}

export default HeroSection;
