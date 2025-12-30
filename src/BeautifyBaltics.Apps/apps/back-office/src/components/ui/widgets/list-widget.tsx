import React, { Fragment } from 'react';
import {
  Divider, Flex, Group, Skeleton, Stack, Text,
} from '@mantine/core';

import Widget, { WidgetProps } from './widget';

interface ListWidgetProps extends WidgetProps {
  fetching?: boolean;
  empty?: boolean;
}

export default function ListWidget({
  fetching, empty, children, ...props
} :ListWidgetProps) {
  const renderLoadingState = () => Array.from({ length: 5 }).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={index}>
      <Group justify="space-between">
        <Group>
          <Skeleton w={42} h={42} radius="sm" />
          <Stack gap={4}>
            <Skeleton w={160} h={16} />
            <Skeleton w={100} h={14} />
          </Stack>
        </Group>
      </Group>
      {index < 4 && <Divider my="xs" />}
    </Fragment>
  ));

  const renderContent = () => {
    if (fetching) return renderLoadingState();
    if (empty) {
      return (
        <Flex align="center" justify="center" h="100%">
          <Text fz="sm" c="gray">No data available</Text>
        </Flex>
      );
    }
    return children;
  };

  return (
    <Widget {...props}>
      <Stack gap={0} mt="md" h="100%">
        {renderContent()}
      </Stack>
    </Widget>
  );
}
