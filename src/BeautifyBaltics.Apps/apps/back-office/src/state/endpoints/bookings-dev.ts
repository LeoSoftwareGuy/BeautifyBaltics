import type { MutationFunction, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { customClient } from '../mutator/custom-client';

const forceCompleteBooking = (id: string) => customClient<void>({
  url: `/api/v1/bookings/${id}/force-complete`,
  method: 'POST',
});

export const useForceCompleteBooking = <TError = unknown, TContext = unknown>(
  options?: { mutation?: UseMutationOptions<void, TError, string, TContext> },
): UseMutationResult<void, TError, string, TContext> => {
  const mutationFn: MutationFunction<void, string> = (id) => forceCompleteBooking(id);
  return useMutation({ mutationKey: ['forceCompleteBooking'], mutationFn, ...options?.mutation });
};
