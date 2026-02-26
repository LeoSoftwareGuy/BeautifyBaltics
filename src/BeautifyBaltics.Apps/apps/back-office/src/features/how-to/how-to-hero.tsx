import { useTranslation } from 'react-i18next';
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

const HERO_DECORATIONS = [
  {
    top: 40, left: 80, size: 140, opacity: 0.2,
  },
  {
    top: 140, right: 120, size: 160, opacity: 0.15,
  },
  {
    bottom: 80, left: 120, size: 120, opacity: 0.18,
  },
];

function HowToHero() {
  const { t } = useTranslation();

  return (
    <Box component="section" pos="relative" py={{ base: 48, md: 80 }} bg="var(--mantine-color-gray-0)">
      <Container size="lg" pos="relative" style={{ zIndex: 1 }}>
        <Stack gap="lg" align="center" ta="center">
          <Badge
            size="lg"
            radius="xl"
            variant="light"
            color="pink"
            styles={{
              root: { paddingInline: 20, height: 'auto' },
              label: { letterSpacing: 2, textTransform: 'uppercase' },
            }}
          >
            {t('howTo.hero.badge')}
          </Badge>
          <Title order={1} fw={800} size="clamp(40px, 6vw, 64px)" lh={1.2} maw={900}>
            {t('howTo.hero.title')}
          </Title>
          <Text size="lg" c="dimmed" maw={640}>
            {t('howTo.hero.description')}
          </Text>
          <Group gap="sm" justify="center" wrap="wrap">
            <Button
              component="a"
              href="#masters"
              color="pink"
              size="md"
              radius="xl"
            >
              {t('howTo.hero.ctaMasters')}
            </Button>
            <Button
              component="a"
              href="#clients"
              variant="subtle"
              size="md"
              radius="xl"
              color="pink"
            >
              {t('howTo.hero.ctaClients')}
            </Button>
          </Group>
        </Stack>
      </Container>
      {HERO_DECORATIONS.map((shape) => (
        <Box
          key={`${shape.top ?? 'x'}-${shape.left ?? shape.right ?? 'y'}`}
          pos="absolute"
          top={shape.top}
          bottom={shape.bottom}
          left={shape.left}
          right={shape.right}
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: 'var(--mantine-color-pink-1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: shape.opacity,
          }}
        />
      ))}
    </Box>
  );
}

export default HowToHero;
