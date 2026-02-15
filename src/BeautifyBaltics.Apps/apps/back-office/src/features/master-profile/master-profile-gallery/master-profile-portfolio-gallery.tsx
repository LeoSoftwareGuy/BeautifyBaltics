import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { LightboxCarousel } from '@/components/lightbox-carousel';
import { useFindMasterJobImages } from '@/state/endpoints/masters';

import MasterPortfolioImage from './master-profile-image';

type PortfolioGalleryProps = {
  masterId: string;
};

function MasterPortfolioGallery({ masterId }: PortfolioGalleryProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useFindMasterJobImages(masterId);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    if (!data?.images) return [];

    return data.images
      .filter((image) => !!image)
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.fileName,
      }));
  }, [data?.images]);

  if (isLoading) {
    return (
      <Stack gap="lg" mt="xl">
        <Title order={2}>{t('masterProfile.portfolio.title')}</Title>
        <SimpleGrid cols={{ base: 2, md: 3 }} spacing="md">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={200} radius="lg" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <Stack gap="lg" mt="xl">
        <Title order={2}>{t('masterProfile.portfolio.title')}</Title>
        <Text c="dimmed">{t('masterProfile.portfolio.empty')}</Text>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap="lg" mt="xl">
        <Title order={2}>{t('masterProfile.portfolio.title')}</Title>
        <SimpleGrid cols={{ base: 2, md: 3 }} spacing="md">
          {items.map((item, index) => (
            <MasterPortfolioImage
              key={item.id}
              item={item}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </SimpleGrid>
      </Stack>

      <LightboxCarousel
        opened={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={items.map((item) => ({ url: item.url, alt: item.alt }))}
        initialIndex={lightboxIndex ?? 0}
      />
    </>
  );
}

export default MasterPortfolioGallery;
