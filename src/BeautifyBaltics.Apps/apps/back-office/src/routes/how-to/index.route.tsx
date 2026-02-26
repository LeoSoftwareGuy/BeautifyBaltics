import { createFileRoute } from '@tanstack/react-router';

import { HowToPage } from '@/features/how-to';

export const Route = createFileRoute('/how-to/')({
  beforeLoad: () => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.home', path: '/home' },
      { titleKey: 'navigation.breadcrumbs.howTo', path: '/how-to' },
    ],
  }),
  component: HowToRoute,
});

function HowToRoute() {
  return <HowToPage />;
}
