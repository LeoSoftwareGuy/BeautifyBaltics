import { createFileRoute } from '@tanstack/react-router';

import { HomeView } from './home/index.route';

export const Route = createFileRoute('/')({
  beforeLoad: () => ({
    breadcrumbs: [
      { title: 'Home', path: '/home' },
    ],
  }),
  component: HomeView,
});
