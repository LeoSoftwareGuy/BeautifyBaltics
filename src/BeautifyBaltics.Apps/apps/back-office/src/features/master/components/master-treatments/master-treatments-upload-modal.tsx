import {
  ActionIcon,
  Box,
  Button,
  FileButton,
  Image,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconTrash, IconUpload } from '@tabler/icons-react';

import type { Treatment } from './master-treatments.types';

type MasterTreatmentsUploadModalProps = {
  opened: boolean;
  onClose: () => void;
  treatment: Treatment | null;
  onUpload: (files: File[] | null) => void;
  onRemoveImage: (treatmentId: string, imageIndex: number) => void;
};

export function MasterTreatmentsUploadModal({
  opened,
  onClose,
  treatment,
  onUpload,
  onRemoveImage,
}: MasterTreatmentsUploadModalProps) {
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
          {treatment
            ? `Add images for "${treatment.name}"`
            : 'Select a treatment to upload media'}
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
              <Button variant="outline" {...props}>
                Select images
              </Button>
            )}
          </FileButton>
        </Stack>
        {treatment && treatment.images.length > 0 && (
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              Uploaded Images (
              {treatment.images.length}
              )
            </Text>
            <SimpleGrid
              cols={{
                base: 1, xs: 2, sm: 3, md: 4,
              }}
              spacing="sm"
            >
              {treatment.images.map((image, index) => (
                <Box key={image} pos="relative">
                  <Image
                    src={image}
                    alt={`Work sample ${index + 1}`}
                    radius="md"
                    h={120}
                    fit="cover"
                  />
                  <ActionIcon
                    variant="filled"
                    size="sm"
                    color="red"
                    style={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => onRemoveImage(treatment.id, index)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
