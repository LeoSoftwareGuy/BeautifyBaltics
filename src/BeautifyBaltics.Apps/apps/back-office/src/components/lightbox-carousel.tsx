import { Carousel } from '@mantine/carousel';
import {
  Box,
  Button,
  Modal,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

import '@mantine/carousel/styles.css';

type LightboxImage = {
  url: string;
  alt?: string;
};

type LightboxCarouselProps = {
  opened: boolean;
  onClose: () => void;
  images: LightboxImage[];
  initialIndex?: number;
};

export function LightboxCarousel({
  opened,
  onClose,
  images,
  initialIndex = 0,
}: LightboxCarouselProps) {
  if (images.length === 0) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      padding={0}
      withCloseButton={false}
      closeOnClickOutside
      styles={{
        content: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          maxWidth: '90vw',
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Box pos="relative">
        <Button
          variant="filled"
          color="dark"
          size="compact-sm"
          radius="xl"
          pos="absolute"
          top={8}
          right={8}
          onClick={onClose}
          style={{ zIndex: 10, opacity: 0.8 }}
        >
          <IconX size={16} />
        </Button>

        {images.length === 1 ? (
          <Box
            component="img"
            src={images[0].url}
            alt={images[0].alt ?? 'Work sample'}
            style={{
              maxHeight: '80vh',
              width: '100%',
              objectFit: 'contain',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          />
        ) : (
          <Carousel
            initialSlide={initialIndex}
            withIndicators
            nextControlIcon={<IconChevronRight size={24} />}
            previousControlIcon={<IconChevronLeft size={24} />}
            styles={{
              control: {
                backgroundColor: 'var(--mantine-color-dark-filled)',
                color: 'white',
                border: 'none',
                opacity: 0.8,
                '&:hover': { opacity: 1 },
              },
              indicator: {
                backgroundColor: 'white',
                opacity: 0.6,
                '&[data-active]': { opacity: 1 },
              },
            }}
          >
            {images.map((image) => (
              <Carousel.Slide key={image.url}>
                <Box
                  component="img"
                  src={image.url}
                  alt={image.alt ?? 'Work sample'}
                  style={{
                    maxHeight: '80vh',
                    width: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        )}
      </Box>
    </Modal>
  );
}
