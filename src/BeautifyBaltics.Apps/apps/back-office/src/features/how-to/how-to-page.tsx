import { useCallback, useState } from 'react';
import { Stack } from '@mantine/core';

import { useSession } from '@/contexts/session-context';

import HowToCtaSection from './how-to-cta-section';
import HowToDashboardSection from './how-to-dashboard-section';
import HowToHero from './how-to-hero';
import HowToJourneySection from './how-to-journey-section';

function HowToPage() {
  const { user } = useSession();
  const [audienceFocus, setAudienceFocus] = useState<'all' | 'masters' | 'clients'>('all');

  const handleAudienceChange = useCallback((target: 'masters' | 'clients') => {
    setAudienceFocus((current) => (current === target ? 'all' : target));
    const journeySection = document.getElementById('how-to-journey');
    journeySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <Stack component="main" gap={0} bg="var(--mantine-color-body)">
      <HowToHero
        selectedAudience={audienceFocus}
        onAudienceChange={handleAudienceChange}
      />
      <HowToJourneySection focus={audienceFocus} />
      <HowToDashboardSection />
      {!user && <HowToCtaSection />}
    </Stack>
  );
}

export default HowToPage;
