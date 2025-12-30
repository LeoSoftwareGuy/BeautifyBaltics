import { useEffect } from 'react';
import { nprogress } from '@mantine/nprogress';
import { useIsFetching } from '@tanstack/react-query';
import { useRouter, useRouterState } from '@tanstack/react-router';

export default function NavigationLoadingIndicator() {
  const isFetching = useIsFetching();
  const router = useRouter();
  const { status } = useRouterState();

  useEffect(() => {
    const unsub = router.subscribe('onBeforeNavigate', () => {
      nprogress.start();
    });

    return () => {
      unsub();
    };
  }, [router]);

  useEffect(() => {
    if (status === 'pending' || isFetching > 0) {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [status, isFetching]);

  return null;
}
