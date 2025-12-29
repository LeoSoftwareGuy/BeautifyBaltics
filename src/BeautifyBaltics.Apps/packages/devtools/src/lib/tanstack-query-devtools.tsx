import React, { Suspense } from 'react';

const QueryDevtools = React.lazy(() => import('@tanstack/react-query-devtools').then((res) => ({
  default: res.ReactQueryDevtools,
})));

interface TanStackRouterDevtoolsProps {
  enabled: boolean;
}

export default function TanStackQueryDevtools({ enabled }: TanStackRouterDevtoolsProps) {
  if (!enabled) return null;

  return (
    <Suspense>
      <QueryDevtools buttonPosition="bottom-right" />
    </Suspense>
  );
}
