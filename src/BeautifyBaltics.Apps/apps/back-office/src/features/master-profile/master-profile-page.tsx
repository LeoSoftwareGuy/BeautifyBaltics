import { useState } from 'react';
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

import { useGetMasterById } from '@/state/endpoints/masters';

import BookingModal from './components/master-profile-booking-modal';
import MasterBookingSection from './master-profile-booking/master-profile-booking-section';
import MasterPortfolioGallery from './master-profile-gallery/master-profile-portfolio-gallery';
import ProfileHeader from './master-profile-header';
import MasterProfileHero from './master-profile-hero';
import MasterServicesList from './master-profile-services-list';

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

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

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

  const handleBooking = (date: Date, slot: string) => {
    setBookingDate(date);
    setBookingSlot(slot);
    setModalOpen(true);
  };

  return (
    <Box bg="var(--mantine-color-body)" pb="xl">
      <ProfileHeader backTo="/explore" />
      <Container size="lg" py="xl">
        <MasterProfileHero master={data} />
        <MasterPortfolioGallery masterId={masterId} />
        <MasterServicesList masterId={masterId} />
        <MasterBookingSection
          masterId={masterId}
          onBook={handleBooking}
        />
      </Container>

      <BookingModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        date={bookingDate}
        slot={bookingSlot}
        address={data.city}
        phone={data.phoneNumber}
      />
    </Box>
  );
}

export default MasterProfilePage;
