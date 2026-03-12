import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  Card,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core';

import {
  ChangesetStatus,
  FindChangesetsParams,
  FindChangesetsResponse,
  FindChangesetsResponsePagedResponse,
} from '@/state/endpoints/api.schemas';
import {
  useFindChangesets,
} from '@/state/endpoints/changesets';

import {
  ChangesetActionButtons,
  ChangesetStatusBadge,
  formatChangeType,
  ProposedChangePreview,
} from './admin-changesets-data-table-renderers';

const DEFAULT_PAGE_SIZE = 10;

export function AdminChangesetsDataTable() {
  const { t } = useTranslation();

  const {
    query,
    onPageChange,
    onRecordsPerPageChange,
    onFilterChange,
  } = usePagedTableQuery<FindChangesetsParams, FindChangesetsResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    status: ChangesetStatus.Pending as ChangesetStatus | undefined,
  });

  const { data: changesetsData, isLoading } = useFindChangesets({
    page: query.page,
    pageSize: query.pageSize,
    status: query.status || undefined,
  });

  const statusOptions = [
    { value: '', label: t('admin.changesets.filters.allStatuses') },
    { value: ChangesetStatus.Pending, label: t('admin.changesets.status.pending') },
    { value: ChangesetStatus.Approved, label: t('admin.changesets.status.approved') },
    { value: ChangesetStatus.Rejected, label: t('admin.changesets.status.rejected') },
  ];

  const columns: PagedDataTableColumn<FindChangesetsResponse>[] = [
    {
      accessor: 'type',
      title: t('admin.changesets.table.columns.changeType'),
      render: (c) => <Text size="sm" fw={500}>{formatChangeType(c.type ?? undefined)}</Text>,
    },
    {
      accessor: 'masterId',
      title: t('admin.changesets.table.columns.masterId'),
      render: (c) => (
        <Text size="xs" c="dimmed" ff="monospace">
          {c.masterId?.slice(0, 8)}
          …
        </Text>
      ),
    },
    {
      accessor: 'proposedAt',
      title: t('admin.changesets.table.columns.proposedAt'),
      render: (c) => (
        <Text size="sm">
          {c.proposedAt ? new Date(c.proposedAt).toLocaleString() : '—'}
        </Text>
      ),
    },
    {
      accessor: 'status',
      title: t('admin.changesets.table.columns.status'),
      render: (c) => (c.status ? <ChangesetStatusBadge status={c.status} /> : null),
    },
    {
      accessor: 'actions',
      title: '',
      render: (c) => (c.status === ChangesetStatus.Pending
        ? <ChangesetActionButtons changeset={c} />
        : null),
    },
  ];

  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="lg">
        <Group gap="sm">
          <Select
            data={statusOptions}
            value={query.status ?? ''}
            onChange={(v) => onFilterChange('status', (v as ChangesetStatus) || undefined)}
            radius="md"
            style={{ minWidth: 160 }}
          />
        </Group>

        <PagedDataTable<FindChangesetsResponsePagedResponse, FindChangesetsResponse>
          idAccessor="id"
          data={changesetsData}
          columns={columns}
          fetching={isLoading}
          onPageChange={onPageChange}
          onRecordsPerPageChange={onRecordsPerPageChange}
          noRecordsText={t('admin.changesets.table.noRecords')}
          rowExpansion={{
            allowMultiple: false,
            content: ({ record }) => (
              <Card p="md" radius={0} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Stack gap="xs">
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                    {t('admin.changesets.proposedChange')}
                  </Text>
                  <ProposedChangePreview data={record.proposedChange} />
                  {record.comment && (
                    <>
                      <Text size="xs" fw={600} tt="uppercase" c="dimmed" mt="xs">
                        {t('admin.changesets.comment')}
                      </Text>
                      <Text size="sm">{record.comment}</Text>
                    </>
                  )}
                </Stack>
              </Card>
            ),
          }}
        />
      </Stack>
    </Card>
  );
}
