import { useEffect } from 'react';
import { Box, Group, Text } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';
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
    <Box style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Left: Image Panel */}
      <Box
        visibleFrom="lg"
        style={{
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url(/shop.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
        }}
      >
        {/* Dark overlay */}
        <Box style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.30)' }} />

        {/* Top-left branding */}
        <Group
          gap="xs"
          style={{
            position: 'absolute', top: 40, left: 40, zIndex: 1,
          }}
        >
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconSparkles size={18} color="#fff" />
          </Box>
          <Text fw={700} fz="lg" c="white" style={{ letterSpacing: '-0.3px' }}>
            Beautify Baltics
          </Text>
        </Group>

        {/* Bottom quote */}
        <Box style={{
          position: 'absolute', bottom: 48, left: 40, right: 40, zIndex: 1,
        }}
        >
          <Text
            fz={32}
            c="white"
            lh={1.3}
            mb="xs"
            style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}
          >
            &ldquo;Your journey to premium beauty starts here.&rdquo;
          </Text>
          <Text fz="xs" c="white" fw={500} style={{ opacity: 0.8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Premium Aesthetics &amp; Wellness
          </Text>
        </Box>
      </Box>

      {/* Right: Form Panel */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem',
          background: '#fff',
          overflowY: 'auto',
        }}
      >
        {/* Mobile branding */}
        <Group gap="xs" mb="xl" hiddenFrom="lg" style={{ alignSelf: 'flex-start' }}>
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--mantine-color-brand-5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconSparkles size={18} color="#fff" />
          </Box>
          <Text fw={700} fz="lg" c="dark">
            Beautify Baltics
          </Text>
        </Group>

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
  );
}
