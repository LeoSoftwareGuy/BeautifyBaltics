import React, { useMemo } from 'react';
import { Stack } from '@mantine/core';

import { DescriptionsContext } from './descriptions-context';
import DescriptionsItem from './descriptions-item';
import { DescriptionsConfiguration } from './types';

interface DescriptionsProps extends DescriptionsConfiguration {
  children: React.ReactNode;
}

function Descriptions({ children, orientation }: DescriptionsProps) {
  const contextValue = useMemo(() => ({ orientation }), [orientation]);

  return (
    <DescriptionsContext.Provider value={contextValue}>
      <Stack gap="xs">{children}</Stack>
    </DescriptionsContext.Provider>
  );
}

Descriptions.Item = DescriptionsItem;

export default Descriptions;
