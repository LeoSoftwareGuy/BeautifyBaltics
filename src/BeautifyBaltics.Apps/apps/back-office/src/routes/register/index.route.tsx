import { useEffect } from 'react';
import { Box, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { AnchorLink } from '@/components/navigation';
import { useSession } from '@/contexts/session-context';
import { RegisterForm } from '@/features/auth';
import type { FileRouteTypes } from '@/routeTree.gen';
import { normalizeRoutePath } from '@/utils/auth';

type RoutePath = FileRouteTypes['to'];
type RoleOption = 'client' | 'master';
type RegisterSearch = {
  redirect: RoutePath;
  role?: RoleOption;
};

export const Route = createFileRoute('/register/')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
    const redirect = normalizeRoutePath(typeof search.redirect === 'string' ? search.redirect : undefined);
    const role = search.role === 'master' || search.role === 'client' ? search.role : undefined;
    return { redirect, role };
  },
  beforeLoad: () => ({
    breadcrumbs: [{ titleKey: 'navigation.breadcrumbs.register', path: '/register' }],
  }),
  component: RegisterView,
});

function RegisterView() {
  const search = Route.useSearch();
  const router = useRouter();
  const { isAuthenticated, loading } = useSession();
  const redirectPath: RoutePath = search.redirect;
  const defaultRole: RoleOption = search.role ?? 'client';
  const isDesktop = useMediaQuery('(min-width: 75em)');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.navigate({ to: redirectPath, replace: true });
    }
  }, [isAuthenticated, loading, redirectPath, router]);

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
    <Box style={{
      minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column',
    }}
    >

      {/* Mobile hero image with gradient overlay */}
      <Box
        hiddenFrom="lg"
        style={{
          width: '100%',
          height: 288,
          backgroundImage: 'url(/shop.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #fff, transparent)' }} />
        <Text
          fw={700}
          fz="sm"
          c="brand"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: 9999,
            padding: '4px 12px',
          }}
        >
          EN ▾
        </Text>
      </Box>

      {/* Desktop split + mobile form */}
      <Box style={{ display: 'flex', flex: 1 }}>

        {/* Desktop left image panel */}
        <Box
          visibleFrom="lg"
          style={{
            width: '50%',
            flexShrink: 0,
            backgroundImage: 'url(/shop.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.30)' }} />
          <Box style={{
            position: 'absolute', bottom: 48, left: 40, right: 40, zIndex: 1,
          }}
          >
            <Text fz={32} c="white" lh={1.3} mb="xs" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>
              &ldquo;Your journey to premium beauty starts here.&rdquo;
            </Text>
            <Text fz="xs" c="white" fw={500} style={{ opacity: 0.8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Premium Aesthetics &amp; Wellness
            </Text>
          </Box>
        </Box>

        {/* Form panel */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isDesktop ? 'center' : 'flex-start',
            padding: isDesktop ? '3rem 1.5rem' : '0 1.5rem 2.5rem',
            background: '#fff',
            overflowY: 'auto',
          }}
        >
          <Box w="100%" maw={480}>
            <RegisterForm
              onRequireEmailVerification={handleEmailVerificationRequired}
              onRegistrationComplete={handleRegistrationComplete}
              defaultRole={defaultRole}
            />
            <Text c="dimmed" fz="sm" ta="center" mt="xl">
              Already have an account?
              {' '}
              <AnchorLink to="/login" search={() => ({ redirect: redirectPath })}>
                Sign in
              </AnchorLink>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
