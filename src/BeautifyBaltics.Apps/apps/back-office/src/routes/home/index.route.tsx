import { createFileRoute } from '@tanstack/react-router';

import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/home/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/home');

    return ({
      breadcrumbs: [
        { title: 'Home', path: '/home' },
      ],
    });
  },
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
