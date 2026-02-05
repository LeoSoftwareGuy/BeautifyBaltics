import { Breadcrumbs } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import AnchorLink from './anchor-link';

export default function NavigationBreadcrumbs() {
  const matches = useMatches();
  const { t } = useTranslation();

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
          {breadcrumb.path === '/' ? t('common:home') : breadcrumb.title}
        </AnchorLink>
      ))}
    </Breadcrumbs>
  );
}
