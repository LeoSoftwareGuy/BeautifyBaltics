import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/features/home';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/home/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/home');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.home', path: '/home' },
      ],
    });
  },
  component: HomeView,
});

export function HomeView() {
  return <HomePage />;
}
