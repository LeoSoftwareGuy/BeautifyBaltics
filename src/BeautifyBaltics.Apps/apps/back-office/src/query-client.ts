import { notifications } from '@mantine/notifications';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

const queryCache = new QueryCache({
  onError: (error) => {
    notifications.show({ title: error.name, message: error.message, color: 'red' });
  },
});

const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    if (mutation.options.onError) return;
    notifications.show({ title: error.name, message: error.message, color: 'red' });
  },
});

export const configureQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Consider data fresh for 2 minutes, so background refetches only happen
      // if it’s older than that
      staleTime: 1000 * 60 * 2,
      // Retry failed GETs twice with exponential backoff (max 30s delay)
      retry: 3,
      // Exponential backoff with a cap at 30 seconds
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      // Don’t refetch on mount/window focus/reconnect unless stale
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // No polling by default
      refetchInterval: false,
    },
    mutations: {
      // Don’t retry mutations by default
      retry: 0,
    },
  },
  queryCache,
  mutationCache,
});
