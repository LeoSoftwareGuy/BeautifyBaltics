import { useState } from 'react';
import { Image } from '@mantine/core';

export default function MasterPortfolioImage({
  item,
  onClick,
}: {
  item: { id: string; url: string; alt?: string };
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Image
      src={item.url}
      alt={item.alt}
      radius="lg"
      h={200}
      fit="cover"
      onClick={onClick}
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
