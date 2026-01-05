/* eslint-disable react/no-array-index-key */
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconPhoto, IconTrash, IconUpload } from '@tabler/icons-react';

import type { Treatment } from './master-treatments.types';

type MasterTreatmentsListProps = {
  treatments: Treatment[];
  onUploadClick: (id: string) => void;
  onDelete: (id: string) => void;
  onRemoveImage: (treatmentId: string, imageIndex: number) => void;
};

export function MasterTreatmentsList({
  treatments,
  onUploadClick,
  onDelete,
  onRemoveImage,
}: MasterTreatmentsListProps) {
  return (
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
            {treatments.map((treatment) => (
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
                      <Text fw={600}>{treatment.name}</Text>
                      <Badge variant="light">{treatment.categoryName}</Badge>
                    </Group>
                    <Group gap="lg" c="dimmed" fz="sm">
                      <Text>
                        €
                        {treatment.price.toFixed(2)}
                      </Text>
                      <Text>
                        {treatment.duration}
                        {' '}
                        min
                      </Text>
                      <Text>
                        {treatment.images.length}
                        {' '}
                        image
                        {treatment.images.length === 1 ? '' : 's'}
                      </Text>
                    </Group>

                    {treatment.images.length > 0 && (
                      <Group gap="xs" mt="xs" wrap="wrap">
                        {treatment.images.map((image, index) => (
                          <Box key={`${image}-${index}`} pos="relative">
                            <Image
                              src={image}
                              alt={`Work sample ${index + 1}`}
                              h={64}
                              w={64}
                              radius="md"
                              fit="cover"
                            />
                            <ActionIcon
                              size="sm"
                              variant="filled"
                              color="red"
                              style={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                              }}
                              onClick={() => onRemoveImage(treatment.id, index)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Box>
                        ))}
                      </Group>
                    )}
                  </Stack>

                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="sm"
                      leftSection={<IconUpload size={14} />}
                      onClick={() => onUploadClick(treatment.id)}
                    >
                      Upload work
                    </Button>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => onDelete(treatment.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
