import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core';

import { CLIENT_STEPS, JourneyStepDefinition, MASTER_STEPS } from './how-to-journey-data';

const STATUS_BADGE_PROPS: Record<'requested' | 'confirmed' | 'completed', { color: string }> = {
  requested: { color: 'blue' },
  confirmed: { color: 'green' },
  completed: { color: 'pink' },
};

interface JourneyColumnProps {
  id: string;
  title: string;
  steps: JourneyStepDefinition[];
  titleAccent: string;
  scopeLabel: string;
}

function JourneyColumn({
  id, title, steps, titleAccent, scopeLabel,
}: JourneyColumnProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="lg" id={id}>
      <Group gap="md" align="center">
        <Box w={48} h={4} bg="var(--mantine-color-pink-4)" style={{ borderRadius: 999 }} />
        <Stack gap={4} h="100%" justify="flex-start">
          <Text fw={600} tt="uppercase" c="pink.6" size="xs" lh={1}>
            {scopeLabel}
          </Text>
          <Title order={2} size="clamp(26px, 3vw, 32px)">
            {title}
            {' '}
            <Text component="span" inherit c={titleAccent}>
              •
            </Text>
          </Title>
        </Stack>
      </Group>
      <Timeline active={steps.length} color="pink" bulletSize={28} lineWidth={2}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Timeline.Item
              key={step.key}
              bullet={(
                <ThemeIcon size={28} radius="xl" color="pink.5" variant="light">
                  <Icon size={16} />
                </ThemeIcon>
              )}
            >
              <Paper withBorder p="lg" radius="lg" shadow="sm">
                <Stack gap="sm">
                  <Title order={3} size="h4">
                    {t(`howTo.${id}.steps.${step.key}.title`)}
                  </Title>
                  <Text c="dimmed" size="sm">
                    {t(`howTo.${id}.steps.${step.key}.description`)}
                  </Text>
                  {step.badges && (
                    <Group gap="xs">
                      {step.badges.map((status) => (
                        <Badge
                          key={status}
                          radius="xl"
                          color={STATUS_BADGE_PROPS[status].color}
                          variant="light"
                        >
                          {t(`howTo.status.${status}`)}
                        </Badge>
                      ))}
                    </Group>
                  )}
                  {step.imageSrc && (
                    <Box
                      mt="sm"
                      pos="relative"
                      style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={step.imageSrc}
                        alt={step.imageAltKey ? t(step.imageAltKey) : ''}
                        h={160}
                        w="100%"
                        fit="cover"
                        radius="md"
                      />
                      <Box
                        pos="absolute"
                        inset={0}
                        style={{
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Stack>
  );
}

type HowToJourneySectionProps = {
  focus: 'all' | 'masters' | 'clients';
};

function HowToJourneySection({ focus }: HowToJourneySectionProps) {
  const { t } = useTranslation();
  const showMasters = focus !== 'clients';
  const showClients = focus !== 'masters';

  return (
    <Box component="section" py={{ base: 48, md: 72 }} id="how-to-journey">
      <Container size="lg">
        <Grid gutter={{ base: 32, md: 48 }}>
          {showMasters && (
            <Grid.Col span={{ base: 12, lg: showClients ? 6 : 12 }}>
              <JourneyColumn
                id="masters"
                title={t('howTo.masters.title')}
                scopeLabel={t('howTo.masters.scope')}
                titleAccent="var(--mantine-color-pink-4)"
                steps={MASTER_STEPS}
              />
            </Grid.Col>
          )}
          {showClients && (
            <Grid.Col span={{ base: 12, lg: showMasters ? 6 : 12 }}>
              <JourneyColumn
                id="clients"
                title={t('howTo.clients.title')}
                scopeLabel={t('howTo.clients.scope')}
                titleAccent="var(--mantine-color-indigo-4)"
                steps={CLIENT_STEPS}
              />
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default HowToJourneySection;
