import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { History, PiggyBank, Sparkles } from 'lucide-react';

const DASHBOARD_CARDS = [
  {
    key: 'upcoming',
    icon: Sparkles,
    accent: 'pink',
  },
  {
    key: 'completed',
    icon: History,
    accent: 'grape',
  },
  {
    key: 'totalSpent',
    icon: PiggyBank,
    accent: 'teal',
  },
];

function HowToDashboardSection() {
  const { t } = useTranslation();

  return (
    <Box component="section" py={{ base: 48, md: 72 }} bg="var(--mantine-color-pink-0)">
      <Container size="lg">
        <Stack gap="sm" ta="center" mb={{ base: 32, md: 48 }}>
          <Title order={2}>{t('howTo.dashboard.title')}</Title>
          <Text c="dimmed">{t('howTo.dashboard.subtitle')}</Text>
        </Stack>
        <Grid gutter={{ base: 24, md: 32 }}>
          {DASHBOARD_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Grid.Col key={card.key} span={{ base: 12, md: 4 }}>
                <Paper withBorder radius="lg" p="xl" shadow="md" h="100%">
                  <Stack gap="sm">
                    <ThemeIcon
                      variant="light"
                      color={card.accent}
                      size={56}
                      radius="xl"
                    >
                      <Icon size={28} />
                    </ThemeIcon>
                    <Stack gap={4}>
                      <Title order={4}>{t(`howTo.dashboard.cards.${card.key}.title`)}</Title>
                      <Text c="dimmed" size="sm">
                        {t(`howTo.dashboard.cards.${card.key}.description`)}
                      </Text>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

export default HowToDashboardSection;
