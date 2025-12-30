import { Breadcrumbs } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useMatches } from '@tanstack/react-router';

import AnchorLink from './anchor-link';

export default function NavigationBreadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = matches
    .flatMap(({ context }) => context.breadcrumbs)
    .filter((breadcrumb, index, self) => self.findIndex((b) => b.path === breadcrumb.path) === index);

  return (
    <Breadcrumbs
      styles={{ root: { flexWrap: 'nowrap' } }}
      separator={<IconChevronRight size={16} />}
      separatorMargin="xs"
    >
      {breadcrumbs.map((breadcrumb) => (
        <AnchorLink
          activeOptions={{ exact: true, includeSearch: false, includeHash: false }}
          activeProps={{ c: 'dark' }}
          c="gray"
          key={breadcrumb.path}
          to={breadcrumb.path}
        >
          {breadcrumb.path === '/' ? 'Home' : breadcrumb.title}
        </AnchorLink>
      ))}
    </Breadcrumbs>
  );
}
