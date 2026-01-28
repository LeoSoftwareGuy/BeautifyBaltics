import React, { useMemo } from 'react';
import {
  AppShell, Box, Divider, Group, ScrollArea, Text, useMantineTheme,
} from '@mantine/core';
import { useFavicon, useLocalStorage } from '@mantine/hooks';

import storageKeygen from '@/utils/storage-keygen';

import Logo from './components/logo';
import ToggleNavbarButton from './components/toggle-navbar-button';
import { AppLayoutContext } from './app-layout-context';

interface AppLayoutProps {
  header: { start: React.ReactNode; end: React.ReactNode };
  navbar: {
    top: React.ReactNode;
    upperMiddle: React.ReactNode;
    lowerMiddle: React.ReactNode;
    bottom: React.ReactNode
  };
  children: React.ReactNode;
  devtools: React.ReactNode[] | React.ReactNode;
}

export default function AppLayout({
  header, navbar, children, devtools,
}: AppLayoutProps) {
  const theme = useMantineTheme();
  const [collapsedNavbar, setCollapsedNavbar] = useLocalStorage({
    key: storageKeygen.create('layout', 'navbar', 'collapsed'),
    defaultValue: true,
  });

  const contextValue = useMemo(() => {
    const navWidth = collapsedNavbar
      ? theme.other.navbar.collapsedWidth
      : theme.other.navbar.width;

    return ({
      navbar: { collapsed: collapsedNavbar, width: navWidth },
    });
  }, [theme, collapsedNavbar]);

  useFavicon(theme.other.favicon);

  const handleToggleNavbar = () => setCollapsedNavbar(!collapsedNavbar);

  return (
    <AppLayoutContext.Provider value={contextValue}>
      <AppShell
        layout="alt"
        header={{ height: theme.other.header.height }}
        navbar={{
          width: collapsedNavbar
            ? theme.other.navbar.collapsedWidth
            : theme.other.navbar.width,
          breakpoint: 0,
        }}
        bg={theme.other.backgroundColor}
      >
        <AppShell.Header p="md">
          <Group gap="xs" align="center" h="100%" wrap="nowrap">
            <ToggleNavbarButton onClick={handleToggleNavbar} />
            <Divider orientation="vertical" my="xs" />
            <Group ml={6} justify="space-between" align="center" h="100%" w="100%" grow wrap="nowrap">
              {header.start}
              {header.end}
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <AppShell.Section mb={-1}>
            <Group p="md" gap="xs" h={68} mih={68} align="center" wrap="nowrap">
              <Logo />
              {collapsedNavbar ? null : <Text fw={700} truncate="end" c={theme.primaryColor}>Beautify Baltics</Text>}
            </Group>
          </AppShell.Section>
          <Divider mx="md" />
          <AppShell.Section px="md" py="xs">
            {navbar.top}
          </AppShell.Section>
          <Divider mx="md" mt={-1} />
          <AppShell.Section grow component={ScrollArea}>
            <Box p="md">
              {navbar.upperMiddle}
            </Box>
          </AppShell.Section>
          <AppShell.Section p="md">
            {navbar.lowerMiddle}
          </AppShell.Section>
          <Divider mx="md" />
          <AppShell.Section p="md">
            {navbar.bottom}
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          {children}
        </AppShell.Main>
        {devtools}
      </AppShell>
    </AppLayoutContext.Provider>
  );
}
