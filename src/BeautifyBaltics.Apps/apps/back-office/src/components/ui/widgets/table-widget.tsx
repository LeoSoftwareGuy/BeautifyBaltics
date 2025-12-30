import { Stack } from '@mantine/core';

import Widget, { WidgetProps } from './widget';

type TableWidgetProps = WidgetProps;

export default function TableWidget({
  children, ...props
} :TableWidgetProps) {
  return (
    <Widget {...props}>
      <Stack gap={0} mt="md" h="100%">
        {children}
      </Stack>
    </Widget>
  );
}
