import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  Badge,
  Card,
  Group,
  Menu,
  NumberFormatter,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconDotsVertical,
  IconSearch,
  IconStar,
  IconTrash,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { DataTableRowExpansionProps } from 'mantine-datatable';

import {
  getFindUsersQueryKey,
  getGetUserStatisticsQueryKey,
  useDeleteUser,
  useFindUsers,
  useSetUserRole,
} from '@/state/endpoints/admin';
import {
  FindUsersParams,
  FindUsersResponse,
  FindUsersResponsePagedResponse,
  UserRole,
} from '@/state/endpoints/api.schemas';

import { AdminUserDetailPanel } from './admin-user-detail-panel';
import { AdminUsersStats } from './admin-users-stats';

const DEFAULT_PAGE_SIZE = 10;

const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.Client]: 'blue',
  [UserRole.Master]: 'violet',
  [UserRole.Admin]: 'red',
};

export function AdminUsersDataTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    query,
    sortStatus,
    onPageChange,
    onRecordsPerPageChange,
    onFilterChange,
    handleSortStatusChange,
  } = usePagedTableQuery<FindUsersParams, FindUsersResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'joinedAt',
    ascending: false,
    search: undefined as string | undefined,
    role: undefined as UserRole | undefined,
  });

  const { data: usersData, isLoading } = useFindUsers({
    page: query.page,
    pageSize: query.pageSize,
    sortBy: query.sortBy,
    ascending: query.ascending,
    search: query.search || undefined,
    role: query.role || undefined,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getFindUsersQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetUserStatisticsQueryKey() });
  };

  const { mutate: setUserRole } = useSetUserRole({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.users.notifications.roleUpdated'), color: 'green' });
        invalidate();
      },
      onError: () => {
        notifications.show({ title: t('admin.users.notifications.errorTitle'), message: t('admin.users.notifications.error'), color: 'red' });
      },
    },
  });

  const { mutate: deleteUser } = useDeleteUser({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.users.notifications.deleted'), color: 'green' });
        invalidate();
      },
      onError: () => {
        notifications.show({ title: t('admin.users.notifications.errorTitle'), message: t('admin.users.notifications.error'), color: 'red' });
      },
    },
  });

  const handleAdminToggle = (user: FindUsersResponse, checked: boolean) => {
    if (!checked) return;
    modals.openConfirmModal({
      title: t('admin.users.promoteModal.title'),
      children: <Text size="sm">{t('admin.users.promoteModal.message', { name: user.fullName ?? user.email ?? '' })}</Text>,
      labels: { confirm: t('admin.users.promoteModal.confirm'), cancel: t('actions.cancel') },
      confirmProps: { color: 'brand' },
      onConfirm: () => setUserRole({ id: user.id, data: { userId: user.id, role: UserRole.Admin } }),
    });
  };

  const handleDelete = (user: FindUsersResponse) => {
    modals.openConfirmModal({
      title: t('admin.users.deleteModal.title'),
      children: <Text size="sm">{t('admin.users.deleteModal.message', { name: user.fullName ?? user.email ?? '' })}</Text>,
      labels: { confirm: t('admin.users.deleteModal.confirm'), cancel: t('actions.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser({ id: user.id }),
    });
  };

  const roleOptions = [
    { value: '', label: t('admin.users.filters.allRoles') },
    { value: UserRole.Client, label: t('admin.users.role.client') },
    { value: UserRole.Master, label: t('admin.users.role.master') },
    { value: UserRole.Admin, label: t('admin.users.role.admin') },
  ];

  const columns: PagedDataTableColumn<FindUsersResponse>[] = [
    {
      accessor: 'fullName',
      title: t('admin.users.table.columns.name'),
      sortKey: 'firstName',
      render: (user) => (
        <div>
          <Text fw={600} size="sm">{user.fullName || '—'}</Text>
          <Text size="xs" c="dimmed">{user.email}</Text>
        </div>
      ),
    },
    {
      accessor: 'role',
      title: t('admin.users.table.columns.role'),
      render: (user) => (
        <Badge variant="light" color={ROLE_COLORS[user.role]} radius="sm">
          {t(`admin.users.role.${user.role.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      accessor: 'totalBookings',
      title: t('admin.users.table.columns.bookings'),
      sortKey: 'totalBookings',
      render: (user) => <Text size="sm" fw={500}>{user.totalBookings ?? 0}</Text>,
    },
    {
      accessor: 'rating',
      title: t('admin.users.table.columns.rating'),
      render: (user) => (user.role === UserRole.Master && (user.rating ?? 0) > 0 ? (
        <Group gap={4}>
          <IconStar size={13} color="var(--mantine-color-yellow-6)" fill="var(--mantine-color-yellow-6)" />
          <Text size="sm" fw={500}>{Number(user.rating).toFixed(1)}</Text>
        </Group>
      ) : <Text size="sm" c="dimmed">—</Text>),
    },
    {
      accessor: 'earnings',
      title: t('admin.users.table.columns.earnings'),
      sortKey: 'earnings',
      render: (user) => (
        <Text size="sm" fw={500}>
          <NumberFormatter value={user.earnings ?? 0} prefix="€" decimalScale={2} fixedDecimalScale />
        </Text>
      ),
    },
    {
      accessor: 'isAdmin',
      title: t('admin.users.table.columns.admin'),
      render: (user) => (
        <Switch
          size="sm"
          checked={user.role === UserRole.Admin}
          disabled={user.role === UserRole.Admin}
          onChange={(e) => handleAdminToggle(user, e.currentTarget.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      accessor: 'actions',
      title: '',
      render: (user) => (
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <UnstyledButton onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
              <IconDotsVertical size={16} color="var(--mantine-color-gray-6)" />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => handleDelete(user)}
            >
              {t('admin.users.actions.delete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const rowExpansion: DataTableRowExpansionProps<FindUsersResponse> = {
    allowMultiple: false,
    content: ({ record }) => <AdminUserDetailPanel user={record} />,
  };

  return (
    <>
      <AdminUsersStats />

      <Card withBorder radius="md" p="lg">
        <Stack gap="lg">
          <Group gap="sm" wrap="wrap">
            <TextInput
              placeholder={t('admin.users.filters.searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              value={query.search ?? ''}
              onChange={(e) => onFilterChange('search', e.currentTarget.value || undefined)}
              radius="md"
              style={{ flex: 1, minWidth: 200 }}
            />
            <Select
              data={roleOptions}
              value={query.role ?? ''}
              onChange={(v) => onFilterChange('role', (v as UserRole) || undefined)}
              radius="md"
              style={{ minWidth: 160 }}
            />
          </Group>

          <PagedDataTable<FindUsersResponsePagedResponse, FindUsersResponse>
            idAccessor="id"
            data={usersData}
            columns={columns}
            fetching={isLoading}
            onPageChange={onPageChange}
            onRecordsPerPageChange={onRecordsPerPageChange}
            sortStatus={sortStatus}
            onSortStatusChange={(s) => handleSortStatusChange(s, columns)}
            noRecordsText={t('admin.users.table.noRecords')}
            rowExpansion={rowExpansion}
          />
        </Stack>
      </Card>
    </>
  );
}
