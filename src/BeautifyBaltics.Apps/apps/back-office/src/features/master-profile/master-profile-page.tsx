import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Stack,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

import type {
  GetMasterByIdResponse,
  MasterAvailabilitySlotDTO,
  MasterJobDTO,
} from '@/state/endpoints/api.schemas';
import { useGetMasterById } from '@/state/endpoints/masters';

import BookingModal from './components/master-profile-booking-modal';
import BookingSection from './components/master-profile-booking-section';
import ProfileHeader from './components/master-profile-header';
import ProfileHero from './components/master-profile-hero';
import PortfolioGallery from './components/master-profile-portfolio-gallery';
import ServicesList from './components/master-profile-services-list';

type MasterProfilePageProps = {
  masterId: string;
};

function MasterProfilePage({ masterId }: MasterProfilePageProps) {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetMasterById(masterId, { id: masterId });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const services = useMemo(() => mapServices(data?.jobs), [data?.jobs]);
  const availableSlots = useMemo(() => mapAvailabilitySlots(data?.availability), [data?.availability]);
  const portfolioItems = useMemo(() => mapPortfolioItems(data), [data]);

  useEffect(() => {
    if (!availableSlots.length) {
      setSelectedSlot(null);
      return;
    }

    if (!selectedSlot || !availableSlots.includes(selectedSlot)) {
      setSelectedSlot(availableSlots[0]);
    }
  }, [availableSlots, selectedSlot]);

  if (isLoading) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="md">
          <Alert
            icon={<AlertCircle size={16} />}
            title="Unable to load master profile"
            color="red"
          >
            Something went wrong while loading this master. Please try again.
          </Alert>
          <Group>
            <Button variant="light" onClick={() => refetch()}>
              Retry
            </Button>
            <Button variant="subtle" onClick={() => navigate({ to: '/explore' })}>
              Back to explore
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  const handleBooking = () => {
    if (selectedDate && selectedSlot) {
      setModalOpen(true);
    }
  };

  return (
    <Box bg="var(--mantine-color-body)" pb="xl">
      <ProfileHeader backTo="/explore" />
      <Container size="lg" py="xl">
        <ProfileHero master={data} />
        <PortfolioGallery items={portfolioItems} />
        <ServicesList services={services} />
        <BookingSection
          availableSlots={availableSlots}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onDateChange={(value) => setSelectedDate(value instanceof Date ? value : null)}
          onSlotChange={(slot) => setSelectedSlot(slot)}
          onBook={handleBooking}
        />
      </Container>

      <BookingModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        slot={selectedSlot}
        address={data.city}
        phone={data.phoneNumber}
      />
    </Box>
  );
}

export default MasterProfilePage;

function mapServices(jobs?: MasterJobDTO[] | null) {
  if (!jobs) return [];

  return jobs.map((job, index) => ({
    id: job.id ?? `service-${index}`,
    name: job.title ?? 'Untitled service',
    duration: typeof job.durationMinutes === 'number' ? `${job.durationMinutes} min` : undefined,
    price: job.price,
  }));
}

function mapAvailabilitySlots(slots?: MasterAvailabilitySlotDTO[] | null) {
  if (!slots) return [];

  return slots
    .map((slot) => formatSlot(slot))
    .filter((slot): slot is string => Boolean(slot));
}

function formatSlot(slot: MasterAvailabilitySlotDTO) {
  if (!slot.startAt) return null;
  const start = new Date(slot.startAt);
  const startLabel = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!slot.endAt) return startLabel;

  const end = new Date(slot.endAt);
  const endLabel = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `${startLabel} - ${endLabel}`;
}

function mapPortfolioItems(master?: GetMasterByIdResponse) {
  if (!master?.jobs?.length) return [];

  return master.jobs
    .flatMap((job) => (job.images ?? []).map((image, index) => ({
      id: image.id ?? `${job.id ?? 'job'}-${index}`,
      url: 'https://placehold.co/400x300?text=Portfolio',
      alt: image.fileName ?? 'Portfolio image',
    })));
}
