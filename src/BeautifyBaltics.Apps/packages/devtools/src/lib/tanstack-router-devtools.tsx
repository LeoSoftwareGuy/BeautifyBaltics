import React, { Suspense } from 'react';

const RouterDevtools = React.lazy(() => import('@tanstack/react-router-devtools').then((res) => ({
  default: res.TanStackRouterDevtools,
})));

interface TanStackRouterDevtoolsProps {
  enabled: boolean;
}

export default function TanStackRouterDevtools({ enabled }: TanStackRouterDevtoolsProps) {
  if (!enabled) return null;

  return (
    <Suspense>
      <RouterDevtools position="bottom-left" />
    </Suspense>
  );
}
