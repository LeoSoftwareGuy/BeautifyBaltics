import type { ApiClientRequest } from '@beautify-baltics-apps/api-client';
import { apiClient } from '@beautify-baltics-apps/api-client';

/**
 * Wraps the shared apiClient. Cookies are sent automatically for same-origin requests.
 */
export const customClient = async <T>(options: ApiClientRequest) => apiClient<T>(options);
