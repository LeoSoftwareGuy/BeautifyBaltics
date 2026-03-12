import { useTranslation } from 'react-i18next';
import { Stack, Title } from '@mantine/core';

import { AdminChangesetsDataTable } from '../admin-changesets-data-table/admin-changesets-data-table';

export default function AdminChangesetsPage() {
  const { t } = useTranslation();

  return (
    <Stack gap="lg">
      <Title order={3}>{t('admin.changesets.pageTitle')}</Title>
      <AdminChangesetsDataTable />
    </Stack>
  );
}
