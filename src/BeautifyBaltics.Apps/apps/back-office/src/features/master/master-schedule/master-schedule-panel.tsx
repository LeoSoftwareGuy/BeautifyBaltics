import { useMemo, useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
} from '@mantine/core';
import dayjs from 'dayjs';

import datetime from '@/utils/datetime';

import {
  MasterSchedulePanelCalendarGrid,
  MasterSchedulePanelUpcomingSlots,
  MasterSchedulePanelWeekNavigation,
  QuickAddSlot,
} from './components';

type SlotDisplay = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date;
  isRecurring?: boolean;
};

interface MasterSchedulePanelProps {
  selectedRange: [Date | null, Date | null];
  onRangeChange: (value: [Date | null, Date | null]) => void;
  startTimeInput: string;
  onStartTimeInputChange: (value: string) => void;
  endTimeInput: string;
  onEndTimeInputChange: (value: string) => void;
  slots: SlotDisplay[];
  onAddSlot: () => void;
  onRemoveSlot: (id: string) => void;
  isLoading?: boolean;
  onViewAllUpcoming?: () => void;
}

export function MasterSchedulePanel({
  selectedRange,
  onRangeChange,
  startTimeInput,
  onStartTimeInputChange,
  endTimeInput,
  onEndTimeInputChange,
  slots,
  onAddSlot,
  onRemoveSlot,
  isLoading = false,
  onViewAllUpcoming,
}: MasterSchedulePanelProps) {
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf('week').add(1, 'day').toDate());

  const weekDates = useMemo(() => datetime.getWeekDates(weekStart), [weekStart]);

  const handlePrevWeek = () => {
    setWeekStart(dayjs(weekStart).subtract(1, 'week').toDate());
  };

  const handleNextWeek = () => {
    setWeekStart(dayjs(weekStart).add(1, 'week').toDate());
  };

  const handleRefresh = () => {
    setWeekStart(dayjs().startOf('week').add(1, 'day').toDate());
  };

  return (
    <Grid gutter={0}>
      <Grid.Col span={8}>
        <Box p="lg" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <MasterSchedulePanelWeekNavigation
            weekStart={weekStart}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onRefresh={handleRefresh}
          />
          <MasterSchedulePanelCalendarGrid
            weekDates={weekDates}
            slots={slots}
            onRemoveSlot={onRemoveSlot}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper
          p="lg"
          style={{
            borderLeft: '1px solid var(--mantine-color-gray-2)',
            borderRadius: 0,
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          <Stack gap="lg">
            <QuickAddSlot
              selectedRange={selectedRange}
              startTimeInput={startTimeInput}
              endTimeInput={endTimeInput}
              isLoading={isLoading}
              onRangeChange={onRangeChange}
              onStartTimeChange={onStartTimeInputChange}
              onEndTimeChange={onEndTimeInputChange}
              onSave={onAddSlot}
            />

            <Divider />
            <MasterSchedulePanelUpcomingSlots slots={slots} onViewAll={onViewAllUpcoming} />
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
