import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconSearch,
  IconShield,
  IconTrash,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  getFindUsersQueryKey,
  getGetUserStatisticsQueryKey,
  useDeleteUser,
  useFindUsers, useSetUserRole,
} from '@/state/endpoints/admin';
import {
  FindUsersParams,
  FindUsersResponse,
  FindUsersResponsePagedResponse,
  UserRole,
} from '@/state/endpoints/api.schemas';

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
    sortBy: 'createdAt',
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

  const handlePromoteToAdmin = (user: FindUsersResponse) => {
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
      accessor: 'phoneNumber',
      title: t('admin.users.table.columns.phone'),
      render: (user) => <Text size="sm">{user.phoneNumber || '—'}</Text>,
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
      accessor: 'emailVerified',
      title: t('admin.users.table.columns.emailVerified'),
      render: (user) => (
        <Badge variant="dot" color={user.emailVerified ? 'green' : 'gray'} radius="sm">
          {user.emailVerified ? t('admin.users.verified') : t('admin.users.unverified')}
        </Badge>
      ),
    },
    {
      accessor: 'createdAt',
      title: t('admin.users.table.columns.joinedAt'),
      sortKey: 'createdAt',
      render: (user) => (
        <Text size="sm">
          {new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      ),
    },
    {
      accessor: 'actions',
      title: t('admin.users.table.columns.actions'),
      render: (user) => (
        <Group gap="xs">
          {user.role !== UserRole.Admin && (
            <ActionIcon
              variant="subtle"
              color="brand"
              title={t('admin.users.actions.promoteToAdmin')}
              onClick={() => handlePromoteToAdmin(user)}
            >
              <IconShield size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="subtle"
            color="red"
            title={t('admin.users.actions.delete')}
            onClick={() => handleDelete(user)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

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
          />
        </Stack>
      </Card>
    </>
  );
}
