import { createFileRoute } from '@tanstack/react-router';

import MasterKycPage from '@/features/master/pages/master-kyc-page';
import { requireAuthenticated } from '@/utils/auth';

export const Route = createFileRoute('/master/kyc/')({
  validateSearch: (search: Record<string, unknown>) => ({
    verificationSessionId: search['verificationSessionId'] as string | undefined,
    status: search['status'] as string | undefined,
  }),
  beforeLoad: async ({ location }) => {
    await requireAuthenticated(location.pathname ?? '/master/kyc');

    return ({
      breadcrumbs: [
        { titleKey: 'navigation.breadcrumbs.masterDashboard', path: '/master' },
        { titleKey: 'navigation.breadcrumbs.masterKyc', path: '/master/kyc' },
      ],
    });
  },
  component: MasterKycRoute,
});

function MasterKycRoute() {
  return <MasterKycPage />;
}
