import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { TooltipProvider } from '@/components/ui/tooltip';

import { queryClient } from './query-client';
import { router } from './router';

const App = () => (
  <MantineProvider>
    <Notifications position="top-right" />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </MantineProvider>
);

export default App;
