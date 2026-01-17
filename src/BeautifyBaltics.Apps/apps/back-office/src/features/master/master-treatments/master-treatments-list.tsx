import { useState } from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle, IconEdit, IconPhoto, IconTrash, IconUpload,
} from '@tabler/icons-react';

import {
  useDeleteMasterJob,
  useDeleteMasterJobImage,
  useFindMasterJobs,
  useUploadMasterJobImage,
} from '@/state/endpoints/masters';

import { MasterTreatmentsEditModal } from './master-treatments-edit-modal';
import { MasterTreatmentsUploadModal } from './master-treatments-upload-modal';

type MasterJobImageProps = {
  url: string;
  alt: string;
  onDelete?: () => void;
  isDeleting?: boolean;
};

function MasterJobImage({
  url, alt, onDelete, isDeleting,
}: MasterJobImageProps) {
  return (
    <Box pos="relative" style={{ width: 64, height: 64 }}>
      <Image
        src={url}
        alt={alt}
        h={64}
        w={64}
        radius="md"
        fit="cover"
      />
      {onDelete && (
        <ActionIcon
          variant="filled"
          color="red"
          size="xs"
          radius="xl"
          pos="absolute"
          top={-6}
          right={-6}
          onClick={onDelete}
          loading={isDeleting}
          style={{ zIndex: 1 }}
        >
          <IconTrash size={12} />
        </ActionIcon>
      )}
    </Box>
  );
}

type MasterTreatmentsListProps = {
  masterId: string;
};

export function MasterTreatmentsList({ masterId }: MasterTreatmentsListProps) {
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const {
    data: jobsData,
    isLoading,
    isError,
    refetch,
  } = useFindMasterJobs(masterId, {
    query: { enabled: !!masterId },
  });

  const treatments = jobsData?.jobs ?? [];
  const selectedJob = treatments.find((job) => job.id === selectedJobId) ?? null;

  const { mutateAsync: deleteJob, isPending: isDeleting } = useDeleteMasterJob({
    mutation: {
      onSuccess: async () => {
        await refetch();
        notifications.show({
          title: 'Treatment deleted',
          message: 'Your treatment has been deleted successfully.',
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to delete treatment',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadMasterJobImage({
    mutation: {
      onSuccess: async () => {
        await refetch();
        notifications.show({
          title: 'Images uploaded',
          message: 'Your images have been uploaded successfully.',
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to upload images',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  const { mutateAsync: deleteImage, isPending: isDeletingImage } = useDeleteMasterJobImage({
    mutation: {
      onSuccess: async () => {
        await refetch();
        notifications.show({
          title: 'Image deleted',
          message: 'The image has been deleted successfully.',
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Failed to delete image',
          message: error.detail,
          color: 'red',
        });
      },
    },
  });

  const handleDeleteImage = async (jobId: string, imageId: string) => {
    await deleteImage({ masterId, jobId, imageId });
  };

  const handleDelete = async (jobId: string) => {
    if (selectedJobId === jobId) {
      setSelectedJobId(null);
      setUploadModalOpened(false);
    }
    await deleteJob({ id: masterId, jobId });
  };

  const handleOpenUploadModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setUploadModalOpened(true);
  };

  const handleOpenEditModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setEditModalOpened(true);
  };

  const handleImageUpload = async (files: File[] | null) => {
    if (!selectedJobId || !files || files.length === 0) return;

    await uploadImage({
      masterId,
      jobId: selectedJobId,
      data: {
        masterId,
        masterJobId: selectedJobId,
        files,
      },
    });
  };

  if (isLoading) {
    return (
      <Card withBorder radius="md">
        <Stack align="center" justify="center" h={200}>
          <Loader size="md" />
          <Text c="dimmed" size="sm">Loading treatments...</Text>
        </Stack>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        Failed to load treatments. Please try again later.
      </Alert>
    );
  }

  return (
    <>
      <Card withBorder radius="md">
        <Stack gap="md">
          <div>
            <Title order={3}>My Treatments</Title>
            <Text c="dimmed" size="sm">
              {treatments.length}
              {' '}
              treatment
              {treatments.length === 1 ? '' : 's'}
              {' '}
              added
            </Text>
          </div>

          {treatments.length === 0 ? (
            <Stack align="center" py="xl" gap="xs">
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  border: '2px dashed var(--mantine-color-gray-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconPhoto
                  size={32}
                  stroke={1.3}
                  color="var(--mantine-color-gray-5)"
                />
              </Box>
              <Text c="dimmed" size="sm">
                No treatments added yet
              </Text>
            </Stack>
          ) : (
            <Stack gap="md">
              {treatments.map((treatment) => {
                const images = treatment.images ?? [];
                return (
                  <Box
                    key={treatment.id}
                    p="md"
                    style={{
                      borderRadius: 12,
                      border: '1px solid var(--mantine-color-gray-3)',
                      backgroundColor: 'var(--mantine-color-default-hover)',
                    }}
                  >
                    <Group align="flex-start" justify="space-between">
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Text fw={600}>{treatment.title ?? treatment.jobName}</Text>
                          {treatment.jobCategoryName && (
                            <Badge variant="light">{treatment.jobCategoryName}</Badge>
                          )}
                        </Group>
                        <Group gap="lg" c="dimmed" fz="sm">
                          <Text>
                            €
                            {(treatment.price ?? 0).toFixed(2)}
                          </Text>
                          <Text>
                            {treatment.durationMinutes ?? 0}
                            {' '}
                            min
                          </Text>
                          <Text>
                            {images.length}
                            {' '}
                            image
                            {images.length === 1 ? '' : 's'}
                          </Text>
                        </Group>

                        {images.length > 0 && treatment.id && (
                          <Group gap="xs" mt="xs" wrap="wrap">
                            {images.map((image) => (
                              <MasterJobImage
                                key={image.id}
                                url={image.url}
                                alt={image.fileName ?? 'Work sample'}
                                onDelete={() => handleDeleteImage(treatment.id, image.id)}
                                isDeleting={isDeletingImage}
                              />
                            ))}
                          </Group>
                        )}
                      </Stack>

                      <Group gap="xs">
                        <Button
                          variant="light"
                          size="sm"
                          leftSection={<IconUpload size={14} />}
                          onClick={() => treatment.id && handleOpenUploadModal(treatment.id)}
                        >
                          Upload work
                        </Button>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => treatment.id && handleOpenEditModal(treatment.id)}
                        >
                          <IconEdit size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          loading={isDeleting}
                          onClick={() => treatment.id && handleDelete(treatment.id)}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Card>

      <MasterTreatmentsUploadModal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        masterId={masterId}
        treatment={selectedJob}
        onUpload={handleImageUpload}
        isUploading={isUploading}
      />

      <MasterTreatmentsEditModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        masterId={masterId}
        treatment={selectedJob}
      />
    </>
  );
}
