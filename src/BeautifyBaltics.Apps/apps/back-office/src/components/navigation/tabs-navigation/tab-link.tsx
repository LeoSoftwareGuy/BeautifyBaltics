import * as React from 'react';
import { TabsTab, TabsTabProps } from '@mantine/core';
import { createLink, CreateLinkProps } from '@tanstack/react-router';

interface TabLinkProps extends CreateLinkProps, Omit<TabsTabProps, 'value'> {
  children: React.ReactNode;
}

const TabLink = createLink(
  React.forwardRef(
    (
      props: TabLinkProps,
      ref: React.ForwardedRef<HTMLButtonElement>,
    ) => (
      <TabsTab {...props} ref={ref} value={props.href ?? ''}>{props.children}</TabsTab>
    ),
  ),
);

export default TabLink;
