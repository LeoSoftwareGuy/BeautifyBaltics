import { Stack } from '@mantine/core';

import FeaturesSection from './home-features-section';
import HeroSection from './home-hero-section';

function Index() {
  return (
    <Stack component="main" gap={0} bg="var(--mantine-color-body)">
      <HeroSection />
      <FeaturesSection />
    </Stack>
  );
}

export default Index;
