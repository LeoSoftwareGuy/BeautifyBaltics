import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

function HowToCtaSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box component="section" py={{ base: 48, md: 80 }}>
      <Container size="lg">
        <Paper
          radius="xl"
          p={{ base: 32, md: 48 }}
          shadow="xl"
          withBorder
          bg="var(--mantine-color-white)"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,210,235,0.6))',
          }}
        >
          <Stack gap="sm" ta="center" align="center">
            <Title order={2}>{t('howTo.cta.title')}</Title>
            <Text c="dimmed" maw={520}>
              {t('howTo.cta.subtitle')}
            </Text>
            <Group gap="sm" mt="md" justify="center" wrap="wrap">
              <Button color="pink" size="md" radius="xl" onClick={() => navigate({ to: '/register', search: { redirect: '/home', role: 'master' } })}>
                {t('howTo.cta.master')}
              </Button>
              <Button variant="outline" color="pink" size="md" radius="xl" onClick={() => navigate({ to: '/register', search: { redirect: '/home', role: 'client' } })}>
                {t('howTo.cta.client')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default HowToCtaSection;
