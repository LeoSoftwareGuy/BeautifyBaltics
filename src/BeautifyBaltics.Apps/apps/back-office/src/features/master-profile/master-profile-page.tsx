import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  Text,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import BookingModal from './components/master-profile-booking-modal';
import BookingSection from './components/master-profile-booking-section';
import ProfileHeader from './components/master-profile-header';
import ProfileHero from './components/master-profile-hero';
import PortfolioGallery from './components/master-profile-portfolio-gallery';
import ServicesList from './components/master-profile-services-list';
import { MASTER_PROFILES, type MasterProfile } from './data';

type MasterProfilePageProps = {
  masterId: string;
};

function MasterProfilePage({ masterId }: MasterProfilePageProps) {
  const navigate = useNavigate();
  const profile: MasterProfile | undefined = useMemo(() => MASTER_PROFILES[masterId], [masterId]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!profile) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="md">
          <Text c="dimmed">Master not found.</Text>
          <Button variant="subtle" onClick={() => navigate({ to: '/explore' })}>
            Back to explore
          </Button>
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
        <ProfileHero profile={profile} />
        <PortfolioGallery items={profile.portfolio} />
        <ServicesList services={profile.services} />
        <BookingSection
          availableSlots={profile.availableSlots}
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
        address={profile.address}
        phone={profile.phone}
      />
    </Box>
  );
}

export default MasterProfilePage;
