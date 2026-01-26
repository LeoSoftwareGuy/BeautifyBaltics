import { createFileRoute } from '@tanstack/react-router';

import { TreatmentsPage } from '@/features/treatments';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/treatments/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/treatments');

    return ({
      breadcrumbs: [
        { title: 'Treatments', path: '/treatments' },
      ],
    });
  },
  component: TreatmentsView,
});

function TreatmentsView() {
  return <TreatmentsPage />;
}
