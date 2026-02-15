import { DevtoolsContainer, TanStackQueryDevtools, TanStackRouterDevtools } from '@beautify-baltics-apps/devtools';
import { Group } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import {
  ClientNavigation,
  MasterNavigation,
  NavigationBreadcrumbs,
  NavigationLoadingIndicator,
  SidebarFooter,
} from '@/components/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
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
  const { t } = useTranslation();
  usePageTitle();
  const location = useRouterState({ select: (state) => state.location });
  const isPublicRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  const { data: user } = useGetUser({ query: { enabled: !isPublicRoute } });
  const isMaster = user?.role === UserRole.Master;

  if (isPublicRoute) {
    return (
      <>
        <NavigationLoadingIndicator />
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
        upperMiddle: isMaster ? <MasterNavigation /> : <ClientNavigation />,
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
