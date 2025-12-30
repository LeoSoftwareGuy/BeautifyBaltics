import { DevtoolsContainer, TanStackQueryDevtools, TanStackRouterDevtools } from '@beautify-baltics-apps/devtools';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import {
  MainNavigation,
  NavigationBreadcrumbs,
  NavigationLoadingIndicator,
  SecondaryNavigation,
} from '@/components/navigation';
import { MegaSearch } from '@/features/mega-search';
import { TenantMenu } from '@/features/multi-tenancy';
import { UserMenu } from '@/features/users';
import usePageTitle from '@/hooks/use-page-title';
import { AppLayout } from '@/layouts';
import { FileRoutesByFullPath } from '@/routeTree.gen';

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

  return (
    <AppLayout
      header={{
        start: <NavigationBreadcrumbs />,
        end: <MegaSearch />,
      }}
      navbar={{
        top: <TenantMenu />,
        upperMiddle: <MainNavigation />,
        lowerMiddle: <SecondaryNavigation />,
        bottom: <UserMenu />,
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
