import { useTranslation } from 'react-i18next';
import {
  Box, Button, FileButton, Image, SimpleGrid, Skeleton, Stack, Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import type { DrawerButtonContentProps } from '@/components/ui/drawer-button';
import type { MasterJobDTO } from '@/state/endpoints/api.schemas';
import {
  getFindMasterJobsQueryKey,
  useGetMasterJobImageById,
  useUploadMasterJobImage,
} from '@/state/endpoints/masters';

type MasterJobImageProps = {
  masterId: string;
  jobId: string;
  imageId: string;
  alt: string;
};

function MasterJobImage({
  masterId, jobId, imageId, alt,
}: MasterJobImageProps) {
  const { t } = useTranslation();
  const { data: imageData, isLoading } = useGetMasterJobImageById(masterId, jobId, imageId);

  if (isLoading) return <Skeleton h={120} radius="md" />;

  return (
    <Image
      src={imageData?.url ?? null}
      alt={alt || t('master.services.upload.imageAlt')}
      radius="md"
      h={120}
      fit="cover"
    />
  );
}

interface MasterServicesUploadProps extends DrawerButtonContentProps {
  masterId: string;
  service: MasterJobDTO;
}

export function MasterServicesUpload({ masterId, service }: MasterServicesUploadProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const images = service.images ?? [];
  const serviceName = service.title ?? service.jobName ?? '';

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadMasterJobImage({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getFindMasterJobsQueryKey(masterId) });
        notifications.show({
          title: t('master.services.notifications.uploadSuccessTitle'),
          message: t('master.services.notifications.uploadSuccessMessage'),
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: t('master.services.notifications.uploadErrorTitle'),
          message: error.detail ?? t('master.services.notifications.uploadErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleUpload = async (files: File[] | null) => {
    if (!files || files.length === 0) return;
    await uploadImage({
      masterId,
      jobId: service.id,
      data: { masterId, masterJobId: service.id, files },
    });
  };

  return (
    <Stack gap="md">
      <Text c="dimmed" size="sm">
        {t('master.services.modals.uploadDescriptionWithName', { name: serviceName })}
      </Text>
      <Stack
        gap="sm"
        align="center"
        p="xl"
        style={{
          borderRadius: 12,
          border: '2px dashed var(--mantine-color-gray-3)',
          textAlign: 'center',
        }}
      >
        <IconUpload size={32} color="var(--mantine-color-gray-5)" />
        <Text c="dimmed" size="sm">
          {t('master.services.modals.uploadHint')}
        </Text>
        <FileButton onChange={handleUpload} accept="image/*" multiple>
          {(props) => (
            <Button variant="outline" loading={isUploading} {...props}>
              {t('master.services.modals.uploadButton')}
            </Button>
          )}
        </FileButton>
      </Stack>
      {images.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            {t('master.services.modals.uploadedCount', { count: images.length })}
          </Text>
          <SimpleGrid
            cols={{
              base: 1, xs: 2, sm: 3, md: 4,
            }}
            spacing="sm"
          >
            {images.map((image, index) => (
              <Box key={image.id}>
                <MasterJobImage
                  masterId={masterId}
                  jobId={service.id}
                  imageId={image.id}
                  alt={image.fileName ?? t('master.services.upload.imageAltWithIndex', { index: index + 1 })}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
