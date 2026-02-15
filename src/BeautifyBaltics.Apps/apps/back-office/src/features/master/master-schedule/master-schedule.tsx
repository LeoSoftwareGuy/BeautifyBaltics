import { useMemo, useState } from 'react';
import {
  Alert, Loader, Stack, Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { AvailabilitySlotType, BookingStatus } from '@/state/endpoints/api.schemas';
import { useFindBookings } from '@/state/endpoints/bookings';
import {
  getFindMasterAvailabilitiesQueryKey,
  useCreateMasterAvailability,
  useDeleteMasterAvailability,
  useFindMasterAvailabilities,
} from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import { MasterSchedulePanelUpcomingDrawer } from './components';
import { MasterSchedulePanel } from './master-schedule-panel';

export function MasterSchedule() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';
  const { t } = useTranslation();

  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startTimeInput, setStartTimeInput] = useState('');
  const [endTimeInput, setEndTimeInput] = useState('');
  const [slotType, setSlotType] = useState<AvailabilitySlotType>(AvailabilitySlotType.Available);
  const [isUpcomingDrawerOpen, setUpcomingDrawerOpen] = useState(false);

  // Fetch availability for a 1-month range to cover the calendar view
  const dateParams = useMemo(() => {
    const now = dayjs();
    return {
      startAt: now.startOf('day').toDate(),
      endAt: now.add(1, 'month').endOf('day').toDate(),
    };
  }, []);

  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
  } = useFindMasterAvailabilities(
    masterId,
    { masterId, ...dateParams },
    { query: { enabled: !!masterId } },
  );

  const { data: bookingsData } = useFindBookings(
    {
      masterId, from: dateParams.startAt, to: dateParams.endAt, pageSize: 100,
    },
    { query: { enabled: !!masterId } },
  );

  const invalidateAvailabilities = async () => {
    await queryClient.invalidateQueries({
      queryKey: getFindMasterAvailabilitiesQueryKey(masterId),
      refetchType: 'all',
    });
  };

  const createAvailability = useCreateMasterAvailability({
    mutation: {
      onSuccess: async () => {
        await invalidateAvailabilities();
        notifications.show({
          title: t('master.timeSlots.notifications.createSuccessTitle'),
          message: t('master.timeSlots.notifications.createSuccessMessage'),
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: t('master.timeSlots.notifications.createErrorTitle'),
          message: t('master.timeSlots.notifications.createErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const deleteAvailability = useDeleteMasterAvailability({
    mutation: {
      onSuccess: async () => {
        await invalidateAvailabilities();
        notifications.show({
          title: t('master.timeSlots.notifications.deleteSuccessTitle'),
          message: t('master.timeSlots.notifications.deleteSuccessMessage'),
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: t('master.timeSlots.notifications.deleteErrorTitle'),
          message: t('master.timeSlots.notifications.deleteErrorMessage'),
          color: 'red',
        });
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
        date: new Date(slot.startAt),
        isRecurring: false,
        slotType: (slot.slotType as AvailabilitySlotType) ?? AvailabilitySlotType.Available,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [availabilityData]);

  const bookings = useMemo(() => {
    const items = bookingsData?.items ?? [];
    return items
      .filter((b) => b.status !== BookingStatus.Cancelled)
      .map((booking) => {
        const scheduledDate = new Date(booking.scheduledAt);
        // Parse duration "HH:MM:SS" to minutes
        const parts = booking.duration.split(':');
        const durationMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        return {
          id: booking.id,
          clientName: booking.clientName,
          serviceName: booking.masterJobTitle,
          startTime: datetime.formatTimeFromDate(scheduledDate),
          durationMinutes,
          date: scheduledDate,
          status: booking.status,
        };
      });
  }, [bookingsData]);

  const futureSlots = useMemo(
    () => slots.filter((slot) => dayjs(slot.date).isAfter(dayjs())),
    [slots],
  );

  const handleAddSlot = async () => {
    const [rangeStart, rawRangeEnd] = selectedRange;
    if (!rangeStart || !startTimeInput || !endTimeInput || !masterId) return;
    const rangeEnd = rawRangeEnd ?? rangeStart;

    const sampleStartAt = datetime.createDateTimeFromDateAndTime(rangeStart, startTimeInput);
    const sampleEndAt = datetime.createDateTimeFromDateAndTime(rangeStart, endTimeInput);

    if (!dayjs(sampleEndAt).isAfter(dayjs(sampleStartAt))) {
      notifications.show({
        title: t('master.timeSlots.notifications.invalidTimeTitle'),
        message: t('master.timeSlots.notifications.invalidTimeMessage'),
        color: 'red',
      });
      return;
    }

    const now = dayjs();
    let startDay = dayjs(rangeStart).startOf('day');
    let endDay = dayjs(rangeEnd).startOf('day');
    if (endDay.isBefore(startDay)) {
      const temp = startDay;
      startDay = endDay;
      endDay = temp;
    }

    const slotsToCreate: { start: Date; end: Date; slotType: AvailabilitySlotType }[] = [];
    let cursor = startDay;
    while (!cursor.isAfter(endDay)) {
      if (cursor.isBefore(now.startOf('day'))) {
        notifications.show({
          title: t('master.timeSlots.notifications.invalidDateTitle'),
          message: t('master.timeSlots.notifications.invalidDateMessage', {
            date: cursor.format('MMM D, YYYY'),
          }),
          color: 'red',
        });
        return;
      }

      const slotStart = datetime.createDateTimeFromDateAndTime(cursor.toDate(), startTimeInput);
      const slotEnd = datetime.createDateTimeFromDateAndTime(cursor.toDate(), endTimeInput);
      if (dayjs(slotStart).isBefore(now)) {
        notifications.show({
          title: t('master.timeSlots.notifications.invalidTimeTitle'),
          message: t('master.timeSlots.notifications.futureTimeMessage'),
          color: 'red',
        });
        return;
      }
      slotsToCreate.push({ start: slotStart, end: slotEnd, slotType });
      cursor = cursor.add(1, 'day');
    }

    await createAvailability.mutateAsync({
      id: masterId,
      data: {
        masterId,
        availability: slotsToCreate,
      },
    });

    setStartTimeInput('');
    setEndTimeInput('');
    setSelectedRange([null, null]);
    setSlotType(AvailabilitySlotType.Available);
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
        <Text c="dimmed">{t('master.timeSlots.loading')}</Text>
      </Stack>
    );
  }

  if (!masterId || isAvailabilityError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={t('master.timeSlots.error.title')} color="red">
        {t('master.timeSlots.error.message')}
      </Alert>
    );
  }

  return (
    <>
      <MasterSchedulePanel
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        startTimeInput={startTimeInput}
        onStartTimeInputChange={setStartTimeInput}
        endTimeInput={endTimeInput}
        onEndTimeInputChange={setEndTimeInput}
        slotType={slotType}
        onSlotTypeChange={setSlotType}
        slots={slots}
        bookings={bookings}
        onAddSlot={handleAddSlot}
        onRemoveSlot={handleRemoveSlot}
        isLoading={createAvailability.isPending || deleteAvailability.isPending}
        onViewAllUpcoming={() => setUpcomingDrawerOpen(true)}
      />
      <MasterSchedulePanelUpcomingDrawer
        opened={isUpcomingDrawerOpen}
        onClose={() => setUpcomingDrawerOpen(false)}
        slots={futureSlots}
      />
    </>
  );
}
