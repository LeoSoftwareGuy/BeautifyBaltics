import { useState } from 'react';
import {
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
} from '@mantine/core';
import {
  IconClock,
  IconCurrencyEuro,
  IconEdit,
  IconPhoto,
  IconUpload,
  IconX,
} from '@tabler/icons-react';

import type { MasterJobDTO } from '@/state/endpoints/api.schemas';

type MasterServicesDetailModalProps = {
  opened: boolean;
  onClose: () => void;
  service: MasterJobDTO | null;
  categoryImageUrl?: string | null;
  onEdit: (id: string) => void;
  onUploadImage: (id: string) => void;
};

export function MasterServicesDetailModal({
  opened,
  onClose,
  service,
  categoryImageUrl,
  onEdit,
  onUploadImage,
}: MasterServicesDetailModalProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!service) return null;

  const displayTitle = service.title ?? service.jobName;
  const images = service.images ?? [];

  const handleEdit = () => {
    onClose();
    onEdit(service.id);
  };

  const handleUpload = () => {
    onClose();
    onUploadImage(service.id);
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
          {categoryImageUrl ? (
            <Box
              component="img"
              src={categoryImageUrl}
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
              {service.jobCategoryName}
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
                {service.jobName}
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
                Upload images
              </Button>
              <Button
                variant="light"
                size="sm"
                leftSection={<IconEdit size={16} />}
                onClick={handleEdit}
              >
                Edit
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
                minutes
              </Text>
            </Group>
          </Group>

          {/* Work Samples Gallery */}
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={600}>
                Work Samples
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
                    No work samples uploaded yet
                  </Text>
                  <Button
                    variant="light"
                    color="brand"
                    size="xs"
                    leftSection={<IconUpload size={14} />}
                    onClick={handleUpload}
                  >
                    Upload images
                  </Button>
                </Stack>
              </Box>
            ) : (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                {images.map((image) => (
                  <Box
                    key={image.id}
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => setLightboxImage(image.url)}
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
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Stack>
      </Modal>

      {/* Lightbox Modal */}
      <Modal
        opened={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        size="xl"
        centered
        padding={0}
        withCloseButton={false}
        styles={{
          content: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          body: {
            padding: 0,
          },
        }}
      >
        <Box pos="relative">
          <Image
            src={lightboxImage ?? ''}
            alt="Work sample"
            fit="contain"
            mah="80vh"
            radius="md"
          />
          <Button
            variant="filled"
            color="dark"
            size="compact-sm"
            radius="xl"
            pos="absolute"
            top={8}
            right={8}
            onClick={() => setLightboxImage(null)}
          >
            <IconX size={16} />
          </Button>
        </Box>
      </Modal>
    </>
  );
}
