import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Group,
  Modal,
  Slider,
  Stack,
  Text,
} from '@mantine/core';
import { IconPhoto, IconRefresh } from '@tabler/icons-react';

import type { MasterJobDTO, SetMasterJobFeaturedImageRequest } from '@/state/endpoints/api.schemas';

type SetFeaturedMutation = (variables: { masterId: string; jobId: string; data: SetMasterJobFeaturedImageRequest }) => Promise<unknown>;

type FeaturedImageAdjustModalProps = {
  opened: boolean;
  onClose: () => void;
  masterId: string;
  service: MasterJobDTO;
  isSaving: boolean;
  setFeaturedImage: SetFeaturedMutation;
  onRefetch: () => void;
};

const focusToPercent = (value?: number | null) => Math.round(((value ?? 0.5) * 100));
const zoomToSlider = (value?: number | null) => Math.round((value ?? 1) * 100);

export function MasterServicesFeaturedImageModal({
  opened,
  onClose,
  masterId,
  service,
  isSaving,
  setFeaturedImage,
  onRefetch,
}: FeaturedImageAdjustModalProps) {
  const { t } = useTranslation();
  const [horizontal, setHorizontal] = useState(focusToPercent(service.featuredImageFocusX));
  const [vertical, setVertical] = useState(focusToPercent(service.featuredImageFocusY));
  const [zoom, setZoom] = useState(zoomToSlider(service.featuredImageZoom));

  const previewImage = useMemo(
    () => service.images?.find((img) => img.id === service.featuredImageId) ?? service.images?.[0],
    [service.featuredImageId, service.images],
  );

  useEffect(() => {
    if (!opened) return;
    setHorizontal(focusToPercent(service.featuredImageFocusX));
    setVertical(focusToPercent(service.featuredImageFocusY));
    setZoom(zoomToSlider(service.featuredImageZoom));
  }, [opened, service.featuredImageFocusX, service.featuredImageFocusY, service.featuredImageZoom]);

  const focusX = horizontal / 100;
  const focusY = vertical / 100;
  const zoomValue = zoom / 100;
  const transformOrigin = `${horizontal}% ${vertical}%`;

  const handleReset = () => {
    setHorizontal(50);
    setVertical(50);
    setZoom(100);
  };

  const handleSave = async () => {
    if (!service.featuredImageId) return;
    await setFeaturedImage({
      masterId,
      jobId: service.id,
      data: {
        masterJobImageId: service.featuredImageId,
        focusX,
        focusY,
        zoom: zoomValue,
      },
    });
    onRefetch();
    onClose();
  };

  const hasFeaturedImage = Boolean(service.featuredImageId && previewImage);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('master.services.detail.adjustModal.title')}
      centered
    >
      <Stack gap="md">
        <Text c="dimmed" size="sm">
          {t('master.services.detail.adjustModal.description')}
        </Text>
        <Box
          h={260}
          w="100%"
          bg="var(--mantine-color-gray-1)"
          style={{ borderRadius: 'var(--mantine-radius-lg)', overflow: 'hidden', position: 'relative' }}
        >
          {previewImage ? (
            <Box
              component="img"
              src={previewImage.url}
              alt={previewImage.fileName ?? 'Featured image'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${horizontal}% ${vertical}%`,
                transform: `scale(${zoomValue})`,
                transformOrigin,
                transition: 'transform 120ms ease, object-position 120ms ease',
              }}
            />
          ) : (
            <Stack align="center" justify="center" h="100%">
              <IconPhoto size={48} color="var(--mantine-color-gray-5)" />
              <Text c="dimmed" size="sm">{t('master.services.detail.noSamples')}</Text>
            </Stack>
          )}
          <Text
            size="xs"
            c="white"
            fw={600}
            bg="rgba(0,0,0,0.4)"
            px="sm"
            py={4}
            pos="absolute"
            top={8}
            left={8}
            style={{ borderRadius: 999 }}
          >
            {t('master.services.detail.adjustModal.previewLabel')}
          </Text>
        </Box>

        <Stack gap="xs" mt="sm">
          <Text fw={600} size="sm">{t('master.services.detail.adjustModal.horizontalLabel')}</Text>
          <Slider
            min={0}
            max={100}
            value={horizontal}
            onChange={setHorizontal}
            marks={[{ value: 0, label: '0%' }, { value: 50, label: '50%' }, { value: 100, label: '100%' }]}
          />
        </Stack>

        <Stack gap="xs" mt="sm">
          <Text fw={600} size="sm">{t('master.services.detail.adjustModal.verticalLabel')}</Text>
          <Slider
            min={0}
            max={100}
            value={vertical}
            onChange={setVertical}
            marks={[{ value: 0, label: '0%' }, { value: 50, label: '50%' }, { value: 100, label: '100%' }]}
          />
        </Stack>

        <Stack gap="xs" mt="sm">
          <Text fw={600} size="sm">{t('master.services.detail.adjustModal.zoomLabel')}</Text>
          <Slider
            min={40}
            max={160}
            step={1}
            value={zoom}
            onChange={setZoom}
            labelAlwaysOn
            label={(value) => `${(value / 100).toFixed(2)}x`}
            marks={[
              { value: 40, label: '0.4x' },
              { value: 80, label: '0.8x' },
              { value: 100, label: '1x' },
              { value: 130, label: '1.3x' },
            ]}
          />
        </Stack>

        <Group justify="space-between" mt="sm">
          <Button
            variant="light"
            color="gray"
            leftSection={<IconRefresh size={16} />}
            onClick={handleReset}
          >
            {t('master.services.detail.adjustModal.reset')}
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            disabled={!hasFeaturedImage}
          >
            {t('master.services.detail.adjustModal.save')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
