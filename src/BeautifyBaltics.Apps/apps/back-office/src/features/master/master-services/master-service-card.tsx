import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconClock, IconEdit, IconPhoto, IconTrash, IconUpload,
} from '@tabler/icons-react';

import type { MasterJobDTO } from '@/state/endpoints/api.schemas';

type MasterServiceCardProps = {
  service: MasterJobDTO;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUploadImage: (id: string) => void;
  isDeleting?: boolean;
};

export function MasterServiceCard({
  service,
  onClick,
  onEdit,
  onDelete,
  onUploadImage,
  isDeleting,
}: MasterServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayTitle = service.title ?? service.jobName;
  const featuredImage = service.featuredImageId
    ? service.images?.find((img) => img.id === service.featuredImageId)
    : null;
  const backgroundImage = featuredImage?.url ?? service.images?.[0]?.url;

  return (
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
            {service.jobCategoryName}
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
            onClick={(e) => {
              e.stopPropagation();
              onUploadImage(service.id);
            }}
            style={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <IconUpload size={16} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="white"
            c="dark"
            radius="md"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(service.id);
            }}
            style={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="red"
            radius="md"
            size="md"
            loading={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(service.id);
            }}
            style={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
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
  );
}
