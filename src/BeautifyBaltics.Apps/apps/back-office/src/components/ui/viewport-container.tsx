import React, { forwardRef } from 'react';
import {
  Box,
  BoxProps,
  createPolymorphicComponent,
  useMantineTheme,
} from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

interface ViewportContainerProps extends BoxProps {
  offset?: number;
  children: React.ReactNode | React.ReactNode[];
}

const ViewportContainer = forwardRef<HTMLDivElement, ViewportContainerProps>(({
  offset = 0,
  style,
  children,
  ...others
}, ref) => {
  const theme = useMantineTheme();
  const { height: viewportHeight } = useViewportSize();

  const mah = viewportHeight - theme.other.header.height - offset - 1;

  return (
    <Box
      component="div"
      mah={mah}
      mih={mah}
      style={{ overflow: 'hidden', ...style }}
      ref={ref}
      {...others}
    >
      {children}
    </Box>
  );
});

export default createPolymorphicComponent<'div', ViewportContainerProps>(ViewportContainer);
