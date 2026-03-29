import { createFileRoute } from '@tanstack/react-router';

import AdminKycPage from '@/features/admin/pages/admin-kyc-page';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/admin/kyc/')({
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/admin/kyc');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.adminDashboard', path: '/admin' },
        { titleKey: 'navigation.breadcrumbs.adminKyc', path: '/admin/kyc' },
      ],
    });
  },
  component: AdminKycRoute,
});

function AdminKycRoute() {
  return <AdminKycPage />;
}
