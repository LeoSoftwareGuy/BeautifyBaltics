import { useTranslation } from 'react-i18next';
import { DevtoolsContainer, TanStackQueryDevtools, TanStackRouterDevtools } from '@beautify-baltics-apps/devtools';
import { Affix, Group, Paper } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router';

import { LanguageSwitcher } from '@/components/language-switcher';
import {
  AuthQuickActions,
  ClientNavigation,
  MasterNavigation,
  NavigationBreadcrumbs,
  NavigationLoadingIndicator,
  SidebarFooter,
} from '@/components/navigation';
import { MegaSearch } from '@/features/mega-search';
import usePageTitle from '@/hooks/use-page-title';
import { AppLayout } from '@/layouts';
import { FileRoutesByFullPath } from '@/routeTree.gen';
import { UserRole } from '@/state/endpoints/api.schemas';
import { useGetUser } from '@/state/endpoints/users';

type Breadcrumb = { titleKey: string; path: keyof FileRoutesByFullPath };

interface RouteContext {
  queryClient: QueryClient;
  breadcrumbs?: Breadcrumb[];
}

export const Route = createRootRouteWithContext<RouteContext>()({
  beforeLoad: () => ({
    breadcrumbs: [{ titleKey: 'navigation.breadcrumbs.brand', path: '/' }],
  }),
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  usePageTitle();
  const location = useRouterState({ select: (state) => state.location });
  const isAuthOnlyRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/reset-password');
  const isMarketingRoute = location.pathname === '/' || location.pathname.startsWith('/home') || location.pathname.startsWith('/how-to');

  const { data: user } = useGetUser({ query: { enabled: !isAuthOnlyRoute } });
  const isMaster = user?.role === UserRole.Master;
  let navContent = null;
  if (user) {
    navContent = isMaster ? <MasterNavigation /> : <ClientNavigation />;
  }

  // Minimal layout: auth pages always, home page only when not logged in
  const showMinimalLayout = isAuthOnlyRoute || (isMarketingRoute && !user);

  if (showMinimalLayout) {
    return (
      <>
        <NavigationLoadingIndicator />
        <AuthQuickActions />
        <Affix position={{ top: 16, left: 16 }} zIndex={201}>
          <Paper
            withBorder
            px="sm"
            py="xs"
            radius="xl"
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255,255,255,0.92)',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            }}
          >
            <LanguageSwitcher compact />
          </Paper>
        </Affix>
        <ModalsProvider>
          <Outlet />
        </ModalsProvider>
      </>
    );
  }

  return (
    <AppLayout
      header={{
        start: <NavigationBreadcrumbs />,
        end: (
          <Group gap="md" align="center" wrap="nowrap">
            <LanguageSwitcher />
            <MegaSearch />
          </Group>
        ),
      }}
      navbar={{
        top: null,
        upperMiddle: navContent,
        lowerMiddle: null,
        bottom: <SidebarFooter />,
      }}
      devtools={(
        <DevtoolsContainer>
          <TanStackRouterDevtools key="router-devtools" enabled={import.meta.env.DEV} />
          <TanStackQueryDevtools key="query-devtools" enabled={import.meta.env.DEV} />
        </DevtoolsContainer>
      )}
    >
      <NavigationLoadingIndicator />
      <ModalsProvider>
        <Outlet />
      </ModalsProvider>
    </AppLayout>
  );
}

function NotFound() {
  const { t } = useTranslation();
  return <div>{t('general.notFound')}</div>;
}
