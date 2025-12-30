import React, { useContext } from 'react';
import { Group, Stack, Text } from '@mantine/core';

import { DescriptionsContext } from './descriptions-context';

interface DescriptionsItemProps {
  label: React.ReactNode;
  align?: React.CSSProperties['alignItems'];
  children: React.ReactNode;
}

export default function Item({ label, align = 'flex-start', children }: DescriptionsItemProps) {
  const { orientation } = useContext(DescriptionsContext);

  if (orientation === 'vertical') {
    return (
      <Stack gap={0}>
        <Text fz="sm" c="gray.6" component="span" mr="xs">{label}</Text>
        {children}
      </Stack>
    );
  }

  return (
    <Group gap="xs" align={align} wrap="nowrap">
      <Text fz="sm" mih={24} component="span" c="gray.6" style={{ whiteSpace: 'nowrap' }}>{label}</Text>
      <Text fz="sm" mih={24} component="span" truncate="end" display="flex" style={{ alignItems: align }} w="100%">{children}</Text>
    </Group>
  );
}
