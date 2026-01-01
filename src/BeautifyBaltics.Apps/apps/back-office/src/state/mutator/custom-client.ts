import { apiClient } from '@beautify-baltics-apps/api-client';
import type { ApiClientRequest } from '@beautify-baltics-apps/api-client';

import { supabase } from '@/integrations/supabase/client';

/**
 * Wraps the shared apiClient and injects the Supabase JWT into every request.
 */
export const customClient = async <T>(options: ApiClientRequest) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return apiClient<T>({
    ...options,
    headers,
  });
};
