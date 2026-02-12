import { useMemo, useState } from 'react';
import {
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { useFindMasterJobImages } from '@/state/endpoints/masters';
import { LightboxCarousel } from '@/components/lightbox-carousel';

import MasterPortfolioImage from './master-profile-image';

type PortfolioGalleryProps = {
  masterId: string;
};

function MasterPortfolioGallery({ masterId }: PortfolioGalleryProps) {
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
        <Title order={2}>Portfolio</Title>
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
        <Title order={2}>Portfolio</Title>
        <Text c="dimmed">Portfolio images will appear here once jobs are uploaded.</Text>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap="lg" mt="xl">
        <Title order={2}>Portfolio</Title>
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
