import { useState } from 'react';
import {
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

type PortfolioGalleryProps = {
  items: Array<{ id: string; url: string; alt?: string }>;
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

function PortfolioGallery({ items }: PortfolioGalleryProps) {
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

export default PortfolioGallery;
