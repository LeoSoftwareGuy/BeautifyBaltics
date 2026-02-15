import { useTranslation } from 'react-i18next';
import {
  Box, Text, Title,
} from '@mantine/core';

import { MasterSchedule } from '../master-schedule';

function MasterTimeSlotsPage() {
  const { t } = useTranslation();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh" p="md">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Title order={2} fw={600}>
          {t('master.timeSlots.page.title')}
        </Title>
        <Text size="sm" c="dimmed">
          {t('master.timeSlots.page.subtitle')}
        </Text>
      </Box>
      <MasterSchedule />
    </Box>
  );
}

export default MasterTimeSlotsPage;
