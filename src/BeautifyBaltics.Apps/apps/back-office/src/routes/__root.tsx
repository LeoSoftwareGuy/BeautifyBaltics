import { DevtoolsContainer, TanStackQueryDevtools, TanStackRouterDevtools } from '@beautify-baltics-apps/devtools';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router';

import {
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

interface RouteContext {
  queryClient: QueryClient;
  breadcrumbs?: ({ title: string, path: keyof FileRoutesByFullPath })[];
}

export const Route = createRootRouteWithContext<RouteContext>()({
  beforeLoad: () => ({
    breadcrumbs: [{ title: 'Beautify Baltics', path: '/' }],
  }),
  component: Root,
  notFoundComponent: () => <div>Not Found</div>,
});

function Root() {
  usePageTitle();
  const location = useRouterState({ select: (state) => state.location });
  const { data: user } = useGetUser();
  const isPublicRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
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
        end: <MegaSearch />,
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
