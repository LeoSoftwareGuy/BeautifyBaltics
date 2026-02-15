import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { customClient } from '../mutator/custom-client';

type SetFeaturedImageParams = {
  masterId: string;
  jobId: string;
  imageId: string | null;
};

type SetFeaturedImageResponse = {
  masterId: string;
  masterJobId: string;
  featuredImageId: string | null;
};

export const setMasterJobFeaturedImage = ({ masterId, jobId, imageId }: SetFeaturedImageParams) => customClient<SetFeaturedImageResponse>({
  url: `/api/v1/masters/${masterId}/jobs/${jobId}/featured-image`,
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  data: { imageId },
});

export const useSetMasterJobFeaturedImage = (
  options?: { mutation?: UseMutationOptions<SetFeaturedImageResponse, Error, SetFeaturedImageParams> },
) => useMutation({
  mutationKey: ['setMasterJobFeaturedImage'],
  mutationFn: setMasterJobFeaturedImage,
  ...options?.mutation,
});
