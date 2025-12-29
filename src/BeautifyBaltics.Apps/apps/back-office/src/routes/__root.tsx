import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
      <Sonner />
    </>
  );
}
