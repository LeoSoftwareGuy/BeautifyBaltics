import { Stack } from '@mantine/core';

import { useSession } from '@/contexts/session-context';
import { HowToPage } from '@/features/how-to';

import FeaturesSection from './home-features-section';
import HeroSection from './home-hero-section';

function HomePage() {
  const { user } = useSession();

  if (user) {
    return <HowToPage />;
  }

  return (
    <Stack component="main" gap={0} bg="var(--mantine-color-body)">
      <HeroSection />
      <FeaturesSection />
    </Stack>
  );
}

export default HomePage;
