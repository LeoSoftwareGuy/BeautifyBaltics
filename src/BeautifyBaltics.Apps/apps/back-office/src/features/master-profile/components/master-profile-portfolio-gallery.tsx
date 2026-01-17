import { useMemo, useState } from 'react';
import {
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { useFindMasterJobImages } from '@/state/endpoints/masters';

type PortfolioGalleryProps = {
  masterId: string;
};

function PortfolioImage({ item }: { item: { id: string; url: string; alt?: string } }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Image
      src={item.url}
      alt={item.alt}
      radius="lg"
      h={200}
      fit="cover"
      style={{
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 150ms ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      fallbackSrc="https://placehold.co/400x300?text=Portfolio"
    />
  );
}

function MasterPortfolioGallery({ masterId }: PortfolioGalleryProps) {
  const { data, isLoading } = useFindMasterJobImages(masterId);

  const items = useMemo(() => {
    if (!data?.images) return [];

    return data.images.map((image) => ({
      id: image.id,
      url: `data:${image.fileMimeType};base64,${image.data}`,
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
    <Stack gap="lg" mt="xl">
      <Title order={2}>Portfolio</Title>
      <SimpleGrid cols={{ base: 2, md: 3 }} spacing="md">
        {items.map((item) => (
          <PortfolioImage key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default MasterPortfolioGallery;
