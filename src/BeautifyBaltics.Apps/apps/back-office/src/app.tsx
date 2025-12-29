import { useLayoutEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import SessionProvider from '@/contexts/session-context';
import SettingsProvider from '@/contexts/settings-context';
import { useTheme } from '@/hooks/use-theme';
import locale from '@/locale';
import { configureQueryClient } from '@/query-client';
import { configureRouter } from '@/router';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import 'mantine-contextmenu/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/charts/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/spotlight/styles.layer.css';
import '@mantine/dropzone/styles.layer.css';
import '@mantine/tiptap/styles.layer.css';
import '@mantine/nprogress/styles.layer.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'flag-icons/css/flag-icons.css';
import './styles.css';

// Create a client
const queryClient = configureQueryClient();

// Create a router instance
const router = configureRouter(queryClient);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const theme = useTheme();

  useLayoutEffect(() => {
    locale.configure(theme.locale);
  }, [theme.locale]);

  return (
    <MantineProvider theme={theme.theme}>
      <NavigationProgress />
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SettingsProvider>
            <RouterProvider router={router} />
            <Notifications position="top-right" />
          </SettingsProvider>
        </SessionProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
