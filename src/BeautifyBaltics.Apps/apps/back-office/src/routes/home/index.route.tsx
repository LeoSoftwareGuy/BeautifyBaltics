import { createFileRoute } from '@tanstack/react-router';

import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';

export const Route = createFileRoute('/home/')({
  beforeLoad: () => ({
    breadcrumbs: [
      { title: 'Home', path: '/home' },
    ],
  }),
  component: HomeView,
});

export function HomeView() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
