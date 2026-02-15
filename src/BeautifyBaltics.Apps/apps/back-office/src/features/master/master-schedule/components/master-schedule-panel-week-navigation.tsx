import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Group,
  Text,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
} from '@tabler/icons-react';

import datetime from '@/utils/datetime';

type WeekNavigationProps = {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onRefresh: () => void;
};

export function MasterSchedulePanelWeekNavigation({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onRefresh,
}: WeekNavigationProps) {
  const { t } = useTranslation();

  return (
    <Group justify="space-between" mb="lg">
      <Group gap="sm">
        <ActionIcon variant="subtle" color="gray" onClick={onPrevWeek}>
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text fw={500}>{datetime.formatWeekRange(weekStart)}</Text>
        <ActionIcon variant="subtle" color="gray" onClick={onNextWeek}>
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>
      <Button
        variant="filled"
        color="brand"
        leftSection={<IconRefresh size={16} />}
        onClick={onRefresh}
      >
        {t('master.timeSlots.weekNavigation.refresh')}
      </Button>
    </Group>
  );
}
