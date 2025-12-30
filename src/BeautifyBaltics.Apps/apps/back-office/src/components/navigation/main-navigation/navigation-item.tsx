import {
  Box, Flex, HoverCard, Text,
  Tooltip, useMantineTheme,
} from '@mantine/core';
import { IconSettingsCog } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';

import { useLayout } from '@/layouts';
import { FileRoutesByTo } from '@/routeTree.gen';

import ActionIconLink from '../action-icon-link';
import NavItemLink from '../nav-item-link';

type NavItem = {
  label: string;
  href: keyof FileRoutesByTo,
};

interface NavigationItemProps extends NavItem {
  icon?: typeof IconSettingsCog,
  subItems?: NavItem[],
}

export default function NavigationItem({
  icon, label, href, subItems,
}: NavigationItemProps) {
  const location = useLocation();
  const theme = useMantineTheme();
  const layout = useLayout();

  const renderIcon = () => {
    if (!icon) return null;
    const Icon = icon;
    return <Icon height={18} width={18} color={theme.black} />;
  };

  const renderSubItem = (subitem: NavItem) => (
    <NavItemLink
      key={subitem.href}
      to={subitem.href}
      color="gray.5"
      c="dark"
      label={subitem.label}
      h={36}
      activeOptions={{
        exact: true,
        includeSearch: false,
      }}
      noWrap
    />
  );

  const renderActionIcon = () => (
    <ActionIconLink
      to={href}
      activeProps={{ variant: 'light' }}
      inactiveProps={{ variant: 'white' }}
      color="gray.5"
      h={40}
      w={38}
      radius="md"
    >
      <Flex justify="center" align="center" h={42}>
        {renderIcon()}
      </Flex>
    </ActionIconLink>
  );

  const renderCollapsedItem = () => {
    const item = subItems ? renderActionIcon() : (
      <Tooltip label={label} position="right" withArrow>
        {renderActionIcon()}
      </Tooltip>
    );

    if (!subItems) return item;

    return (
      <HoverCard width={180} position="right-start" radius="md" shadow="xl">
        <HoverCard.Target>
          {item}
        </HoverCard.Target>
        <HoverCard.Dropdown p="xs" style={{ border: 'none' }}>
          <Box pl="sm" style={{ borderLeft: '1px solid var(--mantine-color-gray-2)' }}>
            <Text p="sm" pb="xs" fz="sm" fw={700}>{label}</Text>
            {subItems?.map(renderSubItem)}
          </Box>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  };

  const renderItem = () => {
    const isSubitem = subItems?.some((i) => i.href === location.pathname) || false;

    return (
      <NavItemLink
        to={href}
        color="gray.5"
        c="dark"
        h={40}
        px="xs"
        label={label}
        leftSection={renderIcon()}
        opened={subItems?.length !== 0}
        activeOptions={{
          exact: isSubitem,
          includeSearch: false,
          includeHash: false,
        }}
        noWrap
      >
        {subItems?.map(renderSubItem)}
      </NavItemLink>
    );
  };

  return layout.navbar.collapsed ? renderCollapsedItem() : renderItem();
}
