import { useTranslation } from 'react-i18next';
import {
  Box,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

import { CLIENT_STEPS, MASTER_STEPS } from './how-to-journey-data';

type AudienceHighlightProps = {
  id: 'masters' | 'clients';
  accent: string;
};

function AudienceHighlight({ id, accent }: AudienceHighlightProps) {
  const { t } = useTranslation();
  const steps = id === 'masters' ? MASTER_STEPS : CLIENT_STEPS;

  return (
    <Stack gap="sm">
      <Text size="xs" tt="uppercase" fw={600} c={`${accent}.3`}>
        {t(`howTo.${id}.scope`)}
      </Text>
      <Title order={3} size="h4" c={`${accent}.0`}>
        {t(`howTo.${id}.title`)}
      </Title>
      <Stack gap="sm">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Group
              key={`${id}-${step.key}`}
              gap="sm"
              align="flex-start"
              wrap="nowrap"
            >
              <ThemeIcon variant="light" color={accent} radius="xl" size="lg">
                <Icon size={16} />
              </ThemeIcon>
              <Stack gap={2} flex={1}>
                <Text fw={600}>{t(`howTo.${id}.steps.${step.key}.title`)}</Text>
                <Text size="sm" c="white" style={{ opacity: 0.85 }}>
                  {t(`howTo.${id}.steps.${step.key}.description`)}
                </Text>
              </Stack>
            </Group>
          );
        })}
      </Stack>
    </Stack>
  );
}

function HowToHighlightsPanel() {
  const { t } = useTranslation();

  return (
    <Box
      visibleFrom="lg"
      style={{
        width: '45%',
        minWidth: 420,
        background:
          'radial-gradient(circle at top left, rgba(231,35,103,0.4), rgba(33,17,22,0.9)), radial-gradient(circle at bottom right, rgba(81,45,168,0.35), rgba(33,17,22,1))',
        color: 'white',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <Stack gap="xs">
        <Text size="xs" tt="uppercase" fw={600} style={{ letterSpacing: 4 }} c="pink.1">
          {t('howTo.hero.badge')}
        </Text>
        <Title order={2} size="h2">
          {t('howTo.hero.title')}
        </Title>
        <Text opacity={0.85}>
          {t('howTo.hero.description')}
        </Text>
      </Stack>

      <ScrollArea h="60vh" type="auto">
        <Stack gap="xl" pr="sm">
          <AudienceHighlight id="masters" accent="pink" />
          <Divider color="white" opacity={0.2} />
          <AudienceHighlight id="clients" accent="indigo" />
        </Stack>
      </ScrollArea>

      <Stack gap={4}>
        <Text size="sm" fw={600}>
          {t('howTo.cta.title')}
        </Text>
        <Text size="sm" opacity={0.7}>
          {t('howTo.cta.subtitle')}
        </Text>
      </Stack>
    </Box>
  );
}

export default HowToHighlightsPanel;
