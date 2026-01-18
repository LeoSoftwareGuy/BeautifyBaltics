import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Briefcase, Calendar, Clock } from 'lucide-react';

import { MasterJobDTO, UserRole } from '@/state/endpoints/api.schemas';
import { useFindMasterAvailabilities, useFindMasterJobs } from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';
import datetime from '@/utils/datetime';

import MasterProfileTimeSlots from './master-profile-booking-time-slot';

type BookingData = {
  availabilityId: string;
  job: MasterJobDTO;
};

type MasterBookingSectionProps = {
  masterId: string;
  onBook: (data: BookingData) => void;
};

function MasterBookingSection({ masterId, onBook }: MasterBookingSectionProps) {
  const { data: user } = useGetUser();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const isOwnProfile = user?.role === UserRole.Master && user?.id === masterId;

  const { data: jobsData } = useFindMasterJobs(masterId);

  const jobs = useMemo(() => jobsData?.jobs ?? [], [jobsData?.jobs]);

  const jobOptions = useMemo(() => jobs.map((job) => ({
    value: job.id,
    label: `${job.title} - $${job.price} (${job.durationMinutes} min)`,
  })), [jobs]);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId),
    [jobs, selectedJobId],
  );

  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const dateRange = useMemo(() => {
    if (!selectedDate) return { startAt: undefined, endAt: undefined };

    const startAt = new Date(selectedDate);
    startAt.setHours(0, 0, 0, 0);

    const endAt = new Date(selectedDate);
    endAt.setHours(23, 59, 59, 999);

    return { startAt, endAt };
  }, [selectedDate]);

  const { data: availabilityData, isLoading } = useFindMasterAvailabilities(
    masterId,
    {
      masterId,
      startAt: dateRange.startAt,
      endAt: dateRange.endAt,
      page: 1,
      pageSize: 50,
    },
  );

  const availableSlots = useMemo(() => {
    if (!availabilityData?.items) return [];

    return availabilityData.items.map((slot) => ({
      id: slot.id,
      label: datetime.formatTimeSlot(slot.startAt, slot.endAt),
    }));
  }, [availabilityData?.items]);

  useEffect(() => {
    if (!availableSlots.length) {
      setSelectedSlotId(null);
      return;
    }

    const currentSlotExists = availableSlots.some((slot) => slot.id === selectedSlotId);
    if (!selectedSlotId || !currentSlotExists) {
      setSelectedSlotId(availableSlots[0].id);
    }
  }, [availableSlots, selectedSlotId]);

  if (isOwnProfile) {
    return null;
  }

  const handleBook = () => {
    if (selectedSlotId && selectedJob) {
      onBook({
        availabilityId: selectedSlotId,
        job: selectedJob,
      });
    }
  };

  const isDisabled = !selectedDate || !selectedSlotId || !selectedJob;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Stack gap="lg" mt="xl">
      <Title order={2}>Book an Appointment</Title>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" h="100%">
            <Stack gap="md">
              <Stack gap={4}>
                <Group gap="xs">
                  <Briefcase size={20} />
                  <Text fw={600} size="lg">Select Service</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  Choose the service you want to book
                </Text>
              </Stack>
              <Select
                data={jobOptions}
                value={selectedJobId}
                onChange={setSelectedJobId}
                placeholder="Select a service"
                allowDeselect={false}
              />

              <Stack gap={4} mt="md">
                <Group gap="xs">
                  <Calendar size={20} />
                  <Text fw={600} size="lg">Select Date</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  Choose your preferred appointment date
                </Text>
              </Stack>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '12px',
              }}
              >
                <div style={{
                  border: '1px solid var(--mantine-color-gray-3)',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                >
                  <DatePicker
                    value={selectedDate}
                    onChange={(value) => {
                      if (typeof value === 'string') {
                        setSelectedDate(new Date(value));
                      } else {
                        setSelectedDate(value);
                      }
                    }}
                    minDate={new Date()}
                  />
                </div>
              </div>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="lg" h="100%">
            <Stack gap="md">
              <Stack gap={4}>
                <Group gap="xs">
                  <Clock size={20} />
                  <Text fw={600} size="lg">Available Time Slots</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {selectedDate ? formatDate(selectedDate) : 'Select a date first'}
                </Text>
              </Stack>
              <MasterProfileTimeSlots
                isLoading={isLoading}
                availableSlots={availableSlots}
                selectedSlotId={selectedSlotId}
                onSlotSelect={setSelectedSlotId}
              />
              <Button
                size="lg"
                disabled={isDisabled}
                onClick={handleBook}
                color="pink"
                radius="md"
                fullWidth
                mt="xl"
                styles={{
                  root: {
                    fontSize: '1rem',
                  },
                }}
              >
                Book Appointment
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default MasterBookingSection;
