import React, { Fragment } from 'react';
import { DonutChart } from '@mantine/charts';
import {
  Box,
  Divider, Flex, Group, NumberFormatter, Skeleton, Stack, Text,
} from '@mantine/core';

import Widget, { WidgetProps } from './widget';

interface ChartWidgetProps extends WidgetProps {
  type: 'bar' | 'donut' | 'area' | 'funnel';
  fetching?: boolean;
  empty?: boolean;
  legend?: {
    title: string;
    value: number | string;
  }[],
}

export default function ChartWidget({
  type, fetching, empty, legend, children, ...props
}: ChartWidgetProps) {
  const renderLegend = () => {
    if (!legend) return null;
    return (
      <Group gap="md" justify="center" mb="md" wrap="nowrap">
        {legend?.map((item, index) => {
          const isLast = index === legend.length - 1;
          return (
            <Fragment key={item.title}>
              {renderLegendItem(item)}
              {!isLast && <Divider orientation="vertical" />}
            </Fragment>
          );
        })}
      </Group>
    );
  };

  const renderLegendItem = (item: { title: string; value: number | string }) => {
    const renderValue = () => {
      if (typeof item.value === 'number') return <NumberFormatter value={item.value} thousandSeparator=" " />;
      return item.value;
    };

    return (
      <Stack gap={0}>
        <Text fz="xs" c="gray">{item.title}</Text>
        <Text fz="sm" fw={700}>
          {renderValue()}
        </Text>
      </Stack>
    );
  };

  const renderLegendLoadingState = () => {
    if (!legend) return null;
    return (
      <Group gap="md" justify="center" mb="md" wrap="nowrap">
        {Array.from({ length: 3 }).map((_, index) => {
          const isLast = index === 2;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={index}>
              <Stack gap={10}>
                <Skeleton h={16} w={100} />
                <Skeleton h={14} w={60} />
              </Stack>
              {!isLast && <Divider orientation="vertical" />}
            </Fragment>
          );
        })}
      </Group>
    );
  };

  const renderLoadingState = () => {
    if (type === 'donut') {
      return (
        <Box pos="relative" h={240}>
          <Skeleton
            h={160}
            w={160}
            circle
            left="50%"
            top="50%"
            style={{ transform: 'translate(-50%, -50%)', borderRadius: '100%' }}
          />
          <Box
            pos="absolute"
            w={120}
            h={120}
            bg="white"
            left="50%"
            top="50%"
            style={{ transform: 'translate(-50%, -50%)', borderRadius: '100%' }}
          />
        </Box>
      );
    }
    if (type === 'bar') {
      return (
        <Stack w="100%">
          <Stack gap={66} w="100%" h="100%">
            {/* eslint-disable-next-line react/no-array-index-key */}
            {Array.from({ length: 5 }).map((_, index) => <Divider w="100%" variant="dashed" key={index} />)}
          </Stack>
          <Group justify="space-between">
            {/* eslint-disable-next-line react/no-array-index-key */}
            {Array.from({ length: 5 }).map((_, index) => <Skeleton h={16} w={40} key={index} />)}
          </Group>
        </Stack>
      );
    }
    if (type === 'area') {
      return (
        <Stack w="100%">
          <Stack gap={46} w="100%" h="100%">
            {Array.from({ length: 5 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Group gap="xs" wrap="nowrap" key={index}>
                <Skeleton h={16} w={20} />
                <Divider w="100%" variant="dashed" />
              </Group>
            ))}
          </Stack>
          <Group justify="space-between">
            {/* eslint-disable-next-line react/no-array-index-key */}
            {Array.from({ length: 5 }).map((_, index) => <Skeleton h={16} w={40} key={index} />)}
          </Group>
        </Stack>
      );
    }
    if (type === 'funnel') {
      return (
        <Stack gap={0} justify="center" align="center">
          <Skeleton radius={0} h={40} w={100} />
          <Skeleton radius={0} h={40} w={80} />
          <Skeleton radius={0} h={40} w={40} />
          <Skeleton radius={0} h={40} w={80} />
        </Stack>
      );
    }
    throw new Error('Loading state not implemented for this chart type');
  };

  const renderEmptyState = () => {
    if (type === 'donut') {
      return <DonutChart data={[{ name: 'empty', value: 100, color: 'gray.1' }]} size={160} chartLabel="0" />;
    }
    return <Text fz="sm" c="gray">No data available</Text>;
  };

  const renderContent = () => {
    if (fetching) return renderLoadingState();
    if (empty) return <Flex justify="center" align="center" h={240}>{renderEmptyState()}</Flex>;
    return children;
  };

  return (
    <Widget {...props}>
      <Stack gap={0} justify="space-between" h="100%">
        <Flex align="center" justify="center" mt="md" h="100%">
          {renderContent()}
        </Flex>
        {fetching ? renderLegendLoadingState() : renderLegend()}
      </Stack>
    </Widget>
  );
}
