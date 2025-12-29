import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import * as qs from 'qs';

import { routeTree } from '@/routeTree.gen';

const parseSearch = (search: string) => {
  if (!search) return {};
  const { state } = qs.parse(search, { ignoreQueryPrefix: true });
  const decoded = decodeURIComponent(Array.prototype.map
    .call(atob(state as string), (c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
    .join(''));
  return qs.parse(decoded);
};

const stringifySearch = (search: Record<string, any>) => {
  const result = qs.stringify(search);
  if (!result) return '';
  const encoded = btoa(
    encodeURIComponent(result).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))),
  );
  return `?${qs.stringify({ state: encoded })}`;
};

export const configureRouter = (queryClient: QueryClient) => createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  parseSearch,
  stringifySearch,
});
