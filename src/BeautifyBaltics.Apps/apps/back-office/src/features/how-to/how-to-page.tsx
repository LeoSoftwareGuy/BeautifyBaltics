import { Stack } from '@mantine/core';

import { useSession } from '@/contexts/session-context';

import HowToCtaSection from './how-to-cta-section';
import HowToDashboardSection from './how-to-dashboard-section';
import HowToHero from './how-to-hero';
import HowToJourneySection from './how-to-journey-section';

function HowToPage() {
  const { user } = useSession();

  return (
    <Stack component="main" gap={0} bg="var(--mantine-color-body)">
      <HowToHero />
      <HowToJourneySection />
      <HowToDashboardSection />
      {!user && <HowToCtaSection />}
    </Stack>
  );
}

export default HowToPage;
