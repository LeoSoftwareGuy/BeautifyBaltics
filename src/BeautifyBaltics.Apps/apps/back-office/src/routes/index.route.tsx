import { createFileRoute } from '@tanstack/react-router';

import { HomeView } from './home/index.route';

export const Route = createFileRoute('/')({
  beforeLoad: () => ({
    breadcrumbs: [
      { titleKey: 'navigation.breadcrumbs.home', path: '/home' },
    ],
  }),
  component: HomeView,
});
