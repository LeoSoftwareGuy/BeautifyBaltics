import { createFileRoute } from '@tanstack/react-router';

import { requireAuthenticated } from '@/utils/auth';

import { HomeView } from './home/index.route';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/');

    return ({
      breadcrumbs: [
        { title: 'Home', path: '/home' },
      ],
    });
  },
  component: HomeView,
});
