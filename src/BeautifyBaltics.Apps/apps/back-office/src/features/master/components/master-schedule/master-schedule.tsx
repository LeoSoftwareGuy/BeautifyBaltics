import { useMemo, useState } from 'react';
import {
  Alert, Loader, Stack, Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

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
  const [slotInput, setSlotInput] = useState('');

  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    refetch,
  } = useFindMasterAvailabilities(masterId, {
    query: { enabled: !!masterId },
  });

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

  const allSlots = useMemo(() => {
    const items = availabilityData?.items ?? [];
    return items;
  }, [availabilityData]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const filtered = allSlots
      .filter((slot) => {
        const matches = datetime.isSameDay(slot.startAt, selectedDate);
        return matches;
      })
      .map((slot) => ({
        id: slot.id,
        time: datetime.formatTimeFromDate(slot.startAt),
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
    return filtered;
  }, [allSlots, selectedDate]);

  const slotTimes = useMemo(
    () => slotsForSelectedDate.map((s) => s.time),
    [slotsForSelectedDate],
  );

  const handleAddSlot = async () => {
    if (!selectedDate || !slotInput || !masterId) return;

    const startAt = datetime.createDateTimeFromDateAndTime(selectedDate, slotInput);
    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + 1);

    await createAvailability.mutateAsync({
      id: masterId,
      data: {
        masterId,
        availability: [{ start: startAt, end: endAt }],
      },
    });

    setSlotInput('');
  };

  const handleRemoveSlot = async (time: string) => {
    if (!masterId) return;

    const slotToRemove = slotsForSelectedDate.find((s) => s.time === time);
    if (!slotToRemove) return;

    await deleteAvailability.mutateAsync({
      id: masterId,
      availabilityId: slotToRemove.id,
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
      slotInput={slotInput}
      onSlotInputChange={setSlotInput}
      slots={slotTimes}
      onAddSlot={handleAddSlot}
      onRemoveSlot={handleRemoveSlot}
      isLoading={createAvailability.isPending || deleteAvailability.isPending}
    />
  );
}
