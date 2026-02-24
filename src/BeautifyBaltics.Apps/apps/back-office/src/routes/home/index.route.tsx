import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/features/home';

export const Route = createFileRoute('/home/')({
  beforeLoad: () => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.home', path: '/home' },
    ],
  }),
  component: HomeView,
});

export function HomeView() {
  return <HomePage />;
}
