import { createFileRoute, useRouter } from '@tanstack/react-router';

import { RegisterForm } from '@/features/auth';
import type { FileRouteTypes } from '@/routeTree.gen';
import { normalizeRoutePath, redirectIfAuthenticated } from '@/utils/auth';

type RoutePath = FileRouteTypes['to'];
type RegisterSearch = {
  redirect: RoutePath;
};

export const Route = createFileRoute('/register/')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    redirect: normalizeRoutePath(typeof search.redirect === 'string' ? search.redirect : undefined),
  }),
  beforeLoad: async ({ search }) => {
    await redirectIfAuthenticated(search.redirect ?? '/home');
    return {
      breadcrumbs: [{ title: 'Register', path: '/register' }],
    };
  },
  component: RegisterView,
});

function RegisterView() {
  const search = Route.useSearch();
  const router = useRouter();
  const redirectPath = search.redirect || '/home';
  const handleEmailVerificationRequired = () => {
    router.navigate({
      to: '/login',
      search: { redirect: redirectPath, registered: true },
      replace: true,
    });
  };

  const handleRegistrationComplete = () => {
    router.navigate({ to: redirectPath, replace: true });
  };

  return (
    <RegisterForm
      onRequireEmailVerification={handleEmailVerificationRequired}
      onRegistrationComplete={handleRegistrationComplete}
    />
  );
}
