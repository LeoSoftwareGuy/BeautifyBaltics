import React from 'react';
import {
  Affix, Box, Divider, Group, rem,
} from '@mantine/core';

interface StickyActionButtonsProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function StickyActionButtons({ children }: StickyActionButtonsProps) {
  return (
    <Box mt={rem(60)} w="100%">
      <Affix withinPortal={false} position={{ bottom: 0, right: 0, left: 0 }}>
        <Divider />
        <Group gap="xs" justify="flex-end" wrap="nowrap" p="md" bg="white" w="100%">
          {children}
        </Group>
      </Affix>
    </Box>
  );
}
