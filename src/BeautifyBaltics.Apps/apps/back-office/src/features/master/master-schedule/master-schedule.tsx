import { useMemo, useState } from 'react';
import {
  Alert, Loader, Stack, Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';

import {
  useCreateMasterAvailability,
  useDeleteMasterAvailability,
  useFindMasterAvailabilities,
} from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import { MasterSchedulePanel } from './master-schedule-panel';

export function MasterSchedule() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTimeInput, setStartTimeInput] = useState('');
  const [endTimeInput, setEndTimeInput] = useState('');
  const [bulkStartTimeInput, setBulkStartTimeInput] = useState('');
  const [bulkEndTimeInput, setBulkEndTimeInput] = useState('');
  const [bulkSlotDuration, setBulkSlotDuration] = useState(60);
  const [bulkDayCount, setBulkDayCount] = useState(1);

  const dateParams = useMemo(() => {
    if (!selectedDate) return { startAt: undefined, endAt: undefined };
    return {
      startAt: dayjs(selectedDate).startOf('day').toDate(),
      endAt: dayjs(selectedDate).endOf('day').toDate(),
    };
  }, [selectedDate]);

  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    refetch,
  } = useFindMasterAvailabilities(
    masterId,
    { masterId, ...dateParams },
    { query: { enabled: !!masterId && !!selectedDate } },
  );

  const createAvailability = useCreateMasterAvailability({
    mutation: {
      onSuccess: async () => {
        await refetch();
      },
    },
  });

  const deleteAvailability = useDeleteMasterAvailability({
    mutation: {
      onSuccess: async () => {
        await refetch();
      },
    },
  });

  const slots = useMemo(() => {
    const items = availabilityData?.items ?? [];
    return items
      .map((slot) => ({
        id: slot.id,
        startTime: datetime.formatTimeFromDate(slot.startAt),
        endTime: datetime.formatTimeFromDate(slot.endAt),
      }))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [availabilityData]);

  const handleAddSlot = async () => {
    if (!selectedDate || !startTimeInput || !endTimeInput || !masterId) return;

    const startAt = datetime.createDateTimeFromDateAndTime(selectedDate, startTimeInput);
    const endAt = datetime.createDateTimeFromDateAndTime(selectedDate, endTimeInput);

    if (!dayjs(endAt).isAfter(dayjs(startAt))) {
      notifications.show({
        title: 'Invalid time slot',
        message: 'End time must be after the start time.',
        color: 'red',
      });
      return;
    }

    if (dayjs(startAt).isBefore(dayjs())) {
      notifications.show({
        title: 'Invalid time slot',
        message: 'Availability slots must start in the future.',
        color: 'red',
      });
      return;
    }

    await createAvailability.mutateAsync({
      id: masterId,
      data: {
        masterId,
        availability: [{ start: startAt, end: endAt }],
      },
    });

    setStartTimeInput('');
    setEndTimeInput('');
  };

  const handleRemoveSlot = async (slotId: string) => {
    if (!masterId) return;

    await deleteAvailability.mutateAsync({
      id: masterId,
      availabilityId: slotId,
    });
  };

  const handleGenerateSlots = async () => {
    if (!selectedDate || !bulkStartTimeInput || !bulkEndTimeInput || !masterId) return;

    const dailyStart = datetime.createDateTimeFromDateAndTime(selectedDate, bulkStartTimeInput);
    const dailyEnd = datetime.createDateTimeFromDateAndTime(selectedDate, bulkEndTimeInput);

    if (!dayjs(dailyEnd).isAfter(dayjs(dailyStart))) {
      notifications.show({
        title: 'Invalid time range',
        message: 'Bulk schedule end time must be after the start time.',
        color: 'red',
      });
      return;
    }

    if (bulkSlotDuration <= 0) {
      notifications.show({
        title: 'Invalid duration',
        message: 'Slot duration must be greater than zero.',
        color: 'red',
      });
      return;
    }

    if (bulkDayCount <= 0) {
      notifications.show({
        title: 'Invalid day count',
        message: 'Please choose at least one day.',
        color: 'red',
      });
      return;
    }

    const slots: { start: Date; end: Date }[] = [];
    for (let dayOffset = 0; dayOffset < bulkDayCount; dayOffset += 1) {
      const dayStart = dayjs(dailyStart).add(dayOffset, 'day');
      const dayEnd = dayjs(dailyEnd).add(dayOffset, 'day');
      let cursor = dayStart;

      while (cursor.isBefore(dayEnd)) {
        const slotEnd = cursor.add(bulkSlotDuration, 'minute');
        if (slotEnd.isAfter(dayEnd) || slotEnd.isSame(cursor)) {
          break;
        }

        slots.push({
          start: cursor.toDate(),
          end: slotEnd.toDate(),
        });

        cursor = slotEnd;
      }
    }

    if (slots.length === 0) {
      notifications.show({
        title: 'No slots generated',
        message: 'Adjust the time range or duration to create slots.',
        color: 'yellow',
      });
      return;
    }

    await createAvailability.mutateAsync({
      id: masterId,
      data: {
        masterId,
        availability: slots.map((slot) => ({
          start: slot.start,
          end: slot.end,
        })),
      },
    });

    setBulkStartTimeInput('');
    setBulkEndTimeInput('');
  };

  if (isUserLoading || isAvailabilityLoading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="lg" />
        <Text c="dimmed">Loading...</Text>
      </Stack>
    );
  }

  if (!masterId || isAvailabilityError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        Failed to load availability data. Please try again later.
      </Alert>
    );
  }

  return (
    <MasterSchedulePanel
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      startTimeInput={startTimeInput}
      onStartTimeInputChange={setStartTimeInput}
      endTimeInput={endTimeInput}
      onEndTimeInputChange={setEndTimeInput}
      slots={slots}
      onAddSlot={handleAddSlot}
      onRemoveSlot={handleRemoveSlot}
      bulkStartTimeInput={bulkStartTimeInput}
      onBulkStartTimeInputChange={setBulkStartTimeInput}
      bulkEndTimeInput={bulkEndTimeInput}
      onBulkEndTimeInputChange={setBulkEndTimeInput}
      bulkSlotDuration={bulkSlotDuration}
      onBulkSlotDurationChange={setBulkSlotDuration}
      bulkDayCount={bulkDayCount}
      onBulkDayCountChange={setBulkDayCount}
      onGenerateBulkSlots={handleGenerateSlots}
      isLoading={createAvailability.isPending || deleteAvailability.isPending}
    />
  );
}
