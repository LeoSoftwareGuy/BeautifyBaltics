import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconClock,
  IconCurrencyEuro,
  IconEdit,
  IconPhoto,
  IconStar,
  IconStarFilled,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { LightboxCarousel } from '@/components/lightbox-carousel';
import { useTranslateData } from '@/hooks/use-translate-data';
import type { MasterJobDTO } from '@/state/endpoints/api.schemas';
import { useDeleteMasterJobImage, useSetMasterJobFeaturedImage } from '@/state/endpoints/masters';

type MasterServicesDetailModalProps = {
  opened: boolean;
  onClose: () => void;
  masterId: string;
  service: MasterJobDTO | null;
  onEdit: (id: string) => void;
  onUploadImage: (id: string) => void;
  onRefetch: () => void;
};

export function MasterServicesDetailModal({
  opened,
  onClose,
  masterId,
  service,
  onEdit,
  onUploadImage,
  onRefetch,
}: MasterServicesDetailModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { translateService, translateCategory } = useTranslateData();
  const { t } = useTranslation();

  const { mutateAsync: setFeaturedImage, isPending: isSettingFeatured } = useSetMasterJobFeaturedImage({
    mutation: {
      onSuccess: () => {
        onRefetch();
        notifications.show({
          title: t('master.services.notifications.featuredSuccessTitle'),
          message: t('master.services.notifications.featuredSuccessMessage'),
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: t('master.services.notifications.featuredErrorTitle'),
          message: t('master.services.notifications.featuredErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteMasterJobImage({
    mutation: {
      onSuccess: () => {
        onRefetch();
        notifications.show({
          title: t('master.services.notifications.deleteImageSuccessTitle'),
          message: t('master.services.notifications.deleteImageSuccessMessage'),
          color: 'green',
        });
      },
      onError: () => {
        notifications.show({
          title: t('master.services.notifications.deleteImageErrorTitle'),
          message: t('master.services.notifications.deleteImageErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  if (!service) return null;

  const displayTitle = translateService(service.title ?? service.jobName);
  const images = service.images ?? [];
  const featuredImage = service.featuredImageId
    ? images.find((img) => img.id === service.featuredImageId)
    : null;
  const headerImageUrl = featuredImage?.url ?? images[0]?.url;

  const handleEdit = () => {
    onClose();
    onEdit(service.id);
  };

  const handleUpload = () => {
    onClose();
    onUploadImage(service.id);
  };

  const handleToggleFeatured = async (imageId: string) => {
    const newFeaturedId = service.featuredImageId === imageId ? null : imageId;
    await setFeaturedImage({ masterId, jobId: service.id, data: { imageId: newFeaturedId } });
  };

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage({ masterId, jobId: service.id, imageId });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        size="lg"
        padding={0}
        withCloseButton={false}
        radius="lg"
        centered
      >
        {/* Header Image */}
        <Box
          pos="relative"
          style={{
            aspectRatio: '21/9',
            overflow: 'hidden',
            backgroundColor: 'var(--mantine-color-gray-1)',
          }}
        >
          {headerImageUrl ? (
            <Box
              component="img"
              src={headerImageUrl}
              alt={displayTitle}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ) : (
            <Box
              h="100%"
              w="100%"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconPhoto size={64} color="var(--mantine-color-gray-4)" />
            </Box>
          )}

          {/* Category Badge */}
          {service.jobCategoryName && (
            <Badge
              variant="filled"
              color="brand"
              size="lg"
              pos="absolute"
              bottom={16}
              left={16}
            >
              {translateCategory(service.jobCategoryName)}
            </Badge>
          )}

          {/* Close Button */}
          <Button
            variant="filled"
            color="dark"
            size="compact-sm"
            radius="xl"
            pos="absolute"
            top={16}
            right={16}
            onClick={onClose}
            style={{ opacity: 0.8 }}
          >
            <IconX size={16} />
          </Button>
        </Box>

        {/* Content */}
        <Stack p="xl" gap="lg">
          {/* Title and Actions */}
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Title order={3}>{displayTitle}</Title>
              <Text c="dimmed" size="sm">
                {translateService(service.jobName)}
              </Text>
            </Stack>
            <Group gap="xs">
              <Button
                variant="light"
                color="brand"
                size="sm"
                leftSection={<IconUpload size={16} />}
                onClick={handleUpload}
              >
                {t('master.services.detail.uploadImages')}
              </Button>
              <Button
                variant="light"
                size="sm"
                leftSection={<IconEdit size={16} />}
                onClick={handleEdit}
              >
                {t('master.services.detail.edit')}
              </Button>
            </Group>
          </Group>

          {/* Price and Duration */}
          <Group gap="xl">
            <Group gap="xs">
              <IconCurrencyEuro size={20} color="var(--mantine-color-brand-6)" />
              <Text fw={700} size="xl" c="brand.6">
                {(service.price ?? 0).toFixed(2)}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock size={20} color="var(--mantine-color-dimmed)" />
              <Text c="dimmed">
                {service.durationMinutes ?? 0}
                {' '}
                {t('master.services.detail.minutes')}
              </Text>
            </Group>
          </Group>

          {/* Work Samples Gallery */}
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={600}>
                {t('master.services.detail.samples')}
                {images.length > 0 && ` (${images.length})`}
              </Text>
            </Group>

            {images.length === 0 ? (
              <Box
                py="xl"
                style={{
                  border: '2px dashed var(--mantine-color-gray-3)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <Stack align="center" gap="xs">
                  <IconPhoto size={32} color="var(--mantine-color-gray-4)" />
                  <Text c="dimmed" size="sm">
                    {t('master.services.detail.noSamples')}
                  </Text>
                  <Button
                    variant="light"
                    color="brand"
                    size="xs"
                    leftSection={<IconUpload size={14} />}
                    onClick={handleUpload}
                  >
                    {t('master.services.detail.uploadImages')}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                {images.map((image) => {
                  const isFeatured = service.featuredImageId === image.id;
                  return (
                    <Box
                      key={image.id}
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => setLightboxIndex(images.indexOf(image))}
                    >
                      <Image
                        src={image.url}
                        alt={image.fileName ?? 'Work sample'}
                        h="100%"
                        w="100%"
                        fit="cover"
                        style={{
                          transition: 'transform 150ms ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      <Tooltip
                        label={isFeatured
                          ? t('master.services.detail.removeFeatured')
                          : t('master.services.detail.setFeatured')}
                        position="top"
                      >
                        <ActionIcon
                          variant="filled"
                          color={isFeatured ? 'yellow' : 'dark'}
                          radius="xl"
                          size="sm"
                          pos="absolute"
                          top={6}
                          right={6}
                          loading={isSettingFeatured}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(image.id);
                          }}
                          style={{ opacity: isFeatured ? 1 : 0.7 }}
                        >
                          {isFeatured ? <IconStarFilled size={14} /> : <IconStar size={14} />}
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={t('master.services.detail.deleteImage')} position="top">
                        <ActionIcon
                          variant="filled"
                          color="red"
                          radius="xl"
                          size="sm"
                          pos="absolute"
                          bottom={6}
                          right={6}
                          loading={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          style={{ opacity: 0.7 }}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Box>
                  );
                })}
              </SimpleGrid>
            )}
          </Stack>
        </Stack>
      </Modal>

      <LightboxCarousel
        opened={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={images.map((img) => ({ url: img.url ?? '', alt: img.fileName ?? 'Work sample' }))}
        initialIndex={lightboxIndex ?? 0}
      />
    </>
  );
}
