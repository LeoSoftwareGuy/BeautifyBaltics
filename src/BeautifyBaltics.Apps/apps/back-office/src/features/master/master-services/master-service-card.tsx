import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconClock, IconEdit, IconPhoto, IconTrash, IconUpload,
} from '@tabler/icons-react';

import useRoutedModal from '@/hooks/use-routed-modal';
import { useTranslateData } from '@/hooks/use-translate-data';
import type { MasterJobDTO } from '@/state/endpoints/api.schemas';

import { EditMasterServicesForm } from './master-services-form';
import { MasterServicesUpload } from './master-services-upload';

type MasterServiceCardProps = {
  masterId: string;
  service: MasterJobDTO;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
};

export function MasterServiceCard({
  masterId,
  service,
  onClick,
  onDelete,
  isDeleting,
}: MasterServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { translateService, translateCategory } = useTranslateData();
  const { t } = useTranslation();

  const { onOpen: onOpenEdit, opened: editOpened, onClose: onCloseEdit } = useRoutedModal(`edit-service-${service.id}`);
  const { onOpen: onOpenUpload, opened: uploadOpened, onClose: onCloseUpload } = useRoutedModal(`upload-service-${service.id}`);

  const displayTitle = translateService(service.title ?? service.jobName);
  const featuredImage = service.featuredImageId
    ? service.images?.find((img) => img.id === service.featuredImageId)
    : null;
  const backgroundImage = featuredImage?.url ?? service.images?.[0]?.url;
  const focusXPercent = Math.round(((service.featuredImageFocusX ?? 0.5) * 100));
  const focusYPercent = Math.round(((service.featuredImageFocusY ?? 0.5) * 100));
  const featuredZoom = service.featuredImageZoom ?? 1;
  const previewScale = featuredZoom * (isHovered ? 1.02 : 1);
  const transformOrigin = `${focusXPercent}% ${focusYPercent}%`;

  return (
    <>
      <Card
        withBorder
        radius="lg"
        p={0}
        style={{
          overflow: 'hidden',
          transition: 'box-shadow 150ms ease, transform 150ms ease',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : undefined,
          transform: isHovered ? 'translateY(-2px)' : undefined,
          cursor: 'pointer',
        }}
        onClick={() => onClick(service.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          pos="relative"
          style={{
            aspectRatio: '16/9',
            overflow: 'hidden',
            backgroundColor: 'var(--mantine-color-gray-1)',
          }}
        >
          {backgroundImage ? (
            <Box
              component="img"
              src={backgroundImage}
              alt={displayTitle}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${focusXPercent}% ${focusYPercent}%`,
                transform: `scale(${previewScale})`,
                transformOrigin,
                transition: 'transform 150ms ease, object-position 150ms ease',
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
              <IconPhoto size={48} color="var(--mantine-color-gray-4)" />
            </Box>
          )}
          {service.jobCategoryName && (
            <Badge
              variant="filled"
              color="brand"
              size="sm"
              pos="absolute"
              bottom={8}
              left={8}
            >
              {translateCategory(service.jobCategoryName)}
            </Badge>
          )}
          <Group
            gap={4}
            pos="absolute"
            top={8}
            right={8}
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 150ms ease',
            }}
          >
            <ActionIcon
              variant="filled"
              color="white"
              c="brand"
              radius="md"
              size="md"
              onClick={(e) => { e.stopPropagation(); onOpenUpload(); }}
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
            >
              <IconUpload size={16} />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              color="white"
              c="dark"
              radius="md"
              size="md"
              onClick={(e) => { e.stopPropagation(); onOpenEdit(); }}
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              color="red"
              radius="md"
              size="md"
              loading={isDeleting}
              onClick={(e) => { e.stopPropagation(); onDelete(service.id); }}
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Box>
        <Stack gap={4} p="md">
          <Text fw={600} lineClamp={1}>
            {displayTitle}
          </Text>
          <Group justify="space-between">
            <Text fw={700} c="brand.6" size="lg">
              €
              {(service.price ?? 0).toFixed(2)}
            </Text>
            <Group gap="md" c="dimmed" fz="sm">
              <Group gap={4}>
                <IconClock size={14} />
                <Text size="sm">
                  {service.durationMinutes ?? 0}
                  {' '}
                  min
                </Text>
              </Group>
              <Group gap={4}>
                <IconPhoto size={14} />
                <Text size="sm">{service.images?.length ?? 0}</Text>
              </Group>
            </Group>
          </Group>
        </Stack>
      </Card>

      <Drawer
        opened={editOpened}
        onClose={onCloseEdit}
        title={t('master.services.modals.editTitle')}
      >
        <Suspense fallback={null}>
          {editOpened ? (
            <EditMasterServicesForm masterId={masterId} service={service} onCancel={onCloseEdit} />
          ) : null}
        </Suspense>
      </Drawer>

      <Drawer
        opened={uploadOpened}
        onClose={onCloseUpload}
        title={t('master.services.modals.uploadTitle')}
      >
        <Suspense fallback={null}>
          {uploadOpened ? (
            <MasterServicesUpload masterId={masterId} service={service} onCancel={onCloseUpload} />
          ) : null}
        </Suspense>
      </Drawer>
    </>
  );
}
