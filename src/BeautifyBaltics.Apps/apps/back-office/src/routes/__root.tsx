import { useTranslation } from 'react-i18next';
import { DevtoolsContainer, TanStackQueryDevtools, TanStackRouterDevtools } from '@beautify-baltics-apps/devtools';
import { Affix, Group } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router';

import { LanguageSwitcher } from '@/components/language-switcher';
import {
  AuthQuickActions,
  ClientBottomNav,
  ClientNavigation,
  MasterBottomNav,
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
          <LanguageSwitcher compact variant={isMarketingRoute ? 'light' : 'dark'} />
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
            <LanguageSwitcher variant="light" />
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
      mobileBottomNav={isMaster || location.pathname === '/master' || location.pathname.startsWith('/master/') ? <MasterBottomNav /> : <ClientBottomNav />}
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
