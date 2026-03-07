import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCoffee,
  IconRefresh,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

import { AvailabilitySlotType, BookingStatus } from '@/state/endpoints/api.schemas';
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
  slotType?: AvailabilitySlotType;
};

type BookingDisplay = {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string;
  durationMinutes: number;
  date: Date;
  status: BookingStatus;
};

interface MasterSchedulePanelProps {
  selectedRange: [Date | null, Date | null];
  onRangeChange: (value: [Date | null, Date | null]) => void;
  startTimeInput: string;
  onStartTimeInputChange: (value: string) => void;
  endTimeInput: string;
  onEndTimeInputChange: (value: string) => void;
  slotType: AvailabilitySlotType;
  onSlotTypeChange: (value: AvailabilitySlotType) => void;
  slots: SlotDisplay[];
  bookings: BookingDisplay[];
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
  slotType,
  onSlotTypeChange,
  slots,
  bookings,
  onAddSlot,
  onRemoveSlot,
  isLoading = false,
  onViewAllUpcoming,
}: MasterSchedulePanelProps) {
  const { t } = useTranslation();
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf('week').add(1, 'day').toDate());
  const [selectedDay, setSelectedDay] = useState(() => dayjs().toDate());

  const weekDates = useMemo(() => datetime.getWeekDates(weekStart), [weekStart]);

  const selectedDaySlots = useMemo(
    () => slots.filter((slot) => datetime.isSameDay(slot.date, selectedDay)),
    [slots, selectedDay],
  );

  const selectedDayBookings = useMemo(
    () => bookings.filter((booking) => datetime.isSameDay(booking.date, selectedDay)),
    [bookings, selectedDay],
  );

  const handlePrevWeek = () => {
    setWeekStart(dayjs(weekStart).subtract(1, 'week').toDate());
  };

  const handleNextWeek = () => {
    setWeekStart(dayjs(weekStart).add(1, 'week').toDate());
  };

  const handleRefresh = () => {
    setWeekStart(dayjs().startOf('week').add(1, 'day').toDate());
    setSelectedDay(dayjs().toDate());
  };

  return (
    <>
      {/* ── MOBILE LAYOUT ── */}
      <Box hiddenFrom="md">
        {/* Sticky header */}
        <Box
          pos="sticky"
          top={0}
          bg="var(--mantine-color-body)"
          style={{ zIndex: 100, borderBottom: '1px solid var(--mantine-color-default-border)' }}
          px="md"
          py="sm"
        >
          <Group justify="space-between" align="center">
            <Box w={36} />
            <Title order={3} style={{ fontFamily: '"Playfair Display", serif' }}>
              {t('master.timeSlots.page.title')}
            </Title>
            <ActionIcon
              variant="subtle"
              color="pink"
              size="lg"
              radius="xl"
              onClick={handleRefresh}
              aria-label={t('master.timeSlots.weekNavigation.refresh')}
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>
        </Box>

        {/* Day selector strip */}
        <Box bg="white" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          <Group justify="space-between" px="md" pt="md" pb="xs">
            <Title order={5} style={{ fontFamily: '"Playfair Display", serif' }}>
              {dayjs(weekStart).format('MMMM YYYY')}
            </Title>
            <Group gap="xs">
              <ActionIcon variant="outline" color="gray" size="sm" radius="xl" onClick={handlePrevWeek}>
                <IconChevronLeft size={14} />
              </ActionIcon>
              <ActionIcon variant="outline" color="gray" size="sm" radius="xl" onClick={handleNextWeek}>
                <IconChevronRight size={14} />
              </ActionIcon>
            </Group>
          </Group>
          <ScrollArea type="never">
            <Group gap="sm" px="md" pb="md" wrap="nowrap">
              {weekDates.map((date) => {
                const isSelected = datetime.isSameDay(date, selectedDay);
                const isToday = datetime.isToday(date);

                let dayNumberColor: string | undefined;
                if (isSelected) dayNumberColor = 'white';
                else if (isToday) dayNumberColor = 'pink';

                return (
                  <UnstyledButton
                    key={date.toISOString()}
                    onClick={() => setSelectedDay(date)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      minWidth: 52,
                      padding: '10px 8px',
                      borderRadius: 14,
                      backgroundColor: isSelected ? 'var(--mantine-color-pink-6)' : 'white',
                      border: isSelected ? 'none' : '1px solid var(--mantine-color-gray-2)',
                      boxShadow: isSelected ? '0 4px 12px rgba(216,85,122,0.25)' : undefined,
                    }}
                  >
                    <Text
                      size="xs"
                      fw={700}
                      tt="uppercase"
                      c={isSelected ? 'white' : 'dimmed'}
                      style={{ letterSpacing: 0.5 }}
                    >
                      {dayjs(date).format('ddd')}
                    </Text>
                    <Text size="lg" fw={700} c={dayNumberColor}>
                      {dayjs(date).format('D')}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </Group>
          </ScrollArea>
        </Box>

        {/* Daily timeline */}
        <Box px="md" mt="lg">
          <Group justify="space-between" mb="md">
            <Title order={4} style={{ fontFamily: '"Playfair Display", serif' }}>
              {t('master.timeSlots.mobile.schedule')}
            </Title>
            <Badge color="pink" variant="light" radius="xl">
              {t('master.timeSlots.mobile.slotsActive', { count: selectedDaySlots.length })}
            </Badge>
          </Group>

          <Box
            pos="relative"
            style={{
              borderLeft: '2px solid var(--mantine-color-pink-2)',
              marginLeft: 8,
              paddingLeft: 24,
              paddingBottom: 8,
            }}
          >
            {selectedDaySlots.length === 0 && selectedDayBookings.length === 0 ? (
              <Text c="dimmed" size="sm" py="xl" ta="center">
                {t('master.timeSlots.mobile.noSlots')}
              </Text>
            ) : (
              <>
                {[
                  ...selectedDaySlots.map((s) => ({ ...s, kind: 'slot' as const })),
                  ...selectedDayBookings.map((b) => ({ ...b, kind: 'booking' as const })),
                ]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((item) => {
                    if (item.kind === 'booking') {
                      return (
                        <Box
                          key={item.id}
                          pos="relative"
                          py="md"
                          style={{ borderBottom: '1px solid var(--mantine-color-gray-1)' }}
                        >
                          <Text
                            size="xs"
                            fw={700}
                            c="dimmed"
                            style={{
                              position: 'absolute', left: -44, top: 18, width: 38, textAlign: 'right',
                            }}
                          >
                            {item.startTime}
                          </Text>
                          <Paper
                            p="sm"
                            radius="md"
                            style={{
                              border: '1px solid var(--mantine-color-blue-2)',
                              backgroundColor: 'var(--mantine-color-blue-0)',
                            }}
                          >
                            <Group justify="space-between">
                              <div>
                                <Text size="sm" fw={700}>{item.clientName}</Text>
                                <Text size="xs" c="dimmed">
                                  {item.startTime}
                                  {' · '}
                                  {t('master.timeSlots.mobile.booking')}
                                </Text>
                              </div>
                              <IconCalendarEvent size={18} color="var(--mantine-color-blue-5)" />
                            </Group>
                          </Paper>
                        </Box>
                      );
                    }

                    const isBreak = item.slotType === AvailabilitySlotType.Break;
                    return (
                      <Box
                        key={item.id}
                        pos="relative"
                        py="md"
                        style={{ borderBottom: '1px solid var(--mantine-color-gray-1)' }}
                      >
                        <Text
                          size="xs"
                          fw={700}
                          c="dimmed"
                          style={{
                            position: 'absolute', left: -44, top: 18, width: 38, textAlign: 'right',
                          }}
                        >
                          {item.startTime}
                        </Text>
                        <Paper
                          p="sm"
                          radius="md"
                          style={{
                            border: isBreak
                              ? '1px dashed var(--mantine-color-pink-3)'
                              : '1px solid var(--mantine-color-gray-2)',
                            backgroundColor: isBreak ? 'var(--mantine-color-pink-0)' : 'white',
                          }}
                        >
                          <Group justify="space-between">
                            <div>
                              <Text size="sm" fw={700} c={isBreak ? 'pink' : undefined}>
                                {isBreak
                                  ? t('master.timeSlots.calendar.break')
                                  : t('master.timeSlots.quickAdd.availability')}
                              </Text>
                              <Text size="xs" c={isBreak ? 'pink.4' : 'dimmed'}>
                                {item.startTime}
                                {' – '}
                                {item.endTime}
                              </Text>
                            </div>
                            {isBreak
                              ? <IconCoffee size={18} color="var(--mantine-color-pink-4)" />
                              : <IconCheck size={18} color="var(--mantine-color-green-5)" />}
                          </Group>
                        </Paper>
                      </Box>
                    );
                  })}
              </>
            )}

          </Box>
        </Box>

        {/* Quick Add Slot */}
        <Box id="mobile-quick-add" px="md" mt="xl" pb="xl">
          <QuickAddSlot
            selectedRange={selectedRange}
            startTimeInput={startTimeInput}
            endTimeInput={endTimeInput}
            slotType={slotType}
            isLoading={isLoading}
            onRangeChange={onRangeChange}
            onStartTimeChange={onStartTimeInputChange}
            onEndTimeChange={onEndTimeInputChange}
            onSlotTypeChange={onSlotTypeChange}
            onSave={onAddSlot}
          />
        </Box>
      </Box>

      {/* ── DESKTOP LAYOUT ── */}
      <Grid visibleFrom="md" gutter={0}>
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
              bookings={bookings}
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
                slotType={slotType}
                isLoading={isLoading}
                onRangeChange={onRangeChange}
                onStartTimeChange={onStartTimeInputChange}
                onEndTimeChange={onEndTimeInputChange}
                onSlotTypeChange={onSlotTypeChange}
                onSave={onAddSlot}
              />

              <Divider />
              <MasterSchedulePanelUpcomingSlots slots={slots} onViewAll={onViewAllUpcoming} />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}
