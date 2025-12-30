import React from 'react';
import { Card, Tabs } from '@mantine/core';
import { useLocation } from '@tanstack/react-router';

import TabLink from './tab-link';

interface TabsNavigationProps {
  withCard?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

function TabsNavigation({ withCard = true, children }: TabsNavigationProps) {
  const location = useLocation();

  const tabs = (
    <Tabs value={location.pathname} variant="pills">
      <Tabs.List>
        {children}
      </Tabs.List>
    </Tabs>
  );

  return withCard ? <Card withBorder p="xs">{tabs}</Card> : tabs;
}

TabsNavigation.Tab = TabLink;

export default TabsNavigation;
