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
  const { data: imageData, isLoading } = useGetMasterJobImageById(masterId, jobId, imageId);

  if (isLoading) {
    return <Skeleton h={120} radius="md" />;
  }

  const imageUrl = imageData?.url ?? null;

  return (
    <Image
      src={imageUrl}
      alt={alt}
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
  const images = service?.images ?? [];
  const serviceName = service?.title ?? service?.jobName ?? '';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload work samples"
      size="lg"
      centered
    >
      <Stack gap="md">
        <Text c="dimmed" size="sm">
          {service
            ? `Add images for "${serviceName}"`
            : 'Select a service to upload media'}
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
            Drag and drop images or use the button below
          </Text>
          <FileButton onChange={onUpload} accept="image/*" multiple>
            {(props) => (
              <Button variant="outline" loading={isUploading} {...props}>
                Select images
              </Button>
            )}
          </FileButton>
        </Stack>
        {service && images.length > 0 && (
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              Uploaded Images (
              {images.length}
              )
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
                    alt={image.fileName ?? `Work sample ${index + 1}`}
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
