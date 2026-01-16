import { useMemo, useState } from 'react';
import {
  Alert, Loader, Stack, Text,
} from '@mantine/core';
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
      isLoading={createAvailability.isPending || deleteAvailability.isPending}
    />
  );
}
