import {
  Box,
  Button,
  FileButton,
  Image,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { MasterJobDTO } from '@/state/endpoints/api.schemas';
import { useGetMasterJobImageById } from '@/state/endpoints/masters';

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

  if (isLoading) {
    return <Skeleton h={120} radius="md" />;
  }

  const imageUrl = imageData?.url ?? null;

  return (
    <Image
      src={imageUrl}
      alt={alt || t('master.services.upload.imageAlt')}
      radius="md"
      h={120}
      fit="cover"
    />
  );
}

type MasterServicesUploadModalProps = {
  opened: boolean;
  onClose: () => void;
  masterId: string;
  service: MasterJobDTO | null;
  onUpload: (files: File[] | null) => void;
  isUploading?: boolean;
};

export function MasterServicesUploadModal({
  opened,
  onClose,
  masterId,
  service,
  onUpload,
  isUploading,
}: MasterServicesUploadModalProps) {
  const { t } = useTranslation();
  const images = service?.images ?? [];
  const serviceName = service?.title ?? service?.jobName ?? '';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('master.services.modals.uploadTitle')}
      size="lg"
      centered
    >
      <Stack gap="md">
        <Text c="dimmed" size="sm">
          {service
            ? t('master.services.modals.uploadDescriptionWithName', { name: serviceName })
            : t('master.services.modals.uploadDescription')}
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
          <FileButton onChange={onUpload} accept="image/*" multiple>
            {(props) => (
              <Button variant="outline" loading={isUploading} {...props}>
                {t('master.services.modals.uploadButton')}
              </Button>
            )}
          </FileButton>
        </Stack>
        {service && images.length > 0 && (
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
    </Modal>
  );
}
