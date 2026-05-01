import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch } from '@tabler/icons-react';

import {
  BookingStatus,
  FindBookingsParams,
  FindBookingsResponse,
  FindBookingsResponsePagedResponse,
} from '@/state/endpoints/api.schemas';
import { useFindBookings } from '@/state/endpoints/bookings';

import { AdminBookingsStats } from './admin-bookings-stats';

const DEFAULT_PAGE_SIZE = 10;

const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.Requested]: 'yellow',
  [BookingStatus.Confirmed]: 'green',
  [BookingStatus.Completed]: 'blue',
  [BookingStatus.Cancelled]: 'red',
};

export function AdminBookingsDataTable() {
  const { t } = useTranslation();

  const {
    query,
    sortStatus,
    onPageChange,
    onRecordsPerPageChange,
    onFilterChange,
    handleSortStatusChange,
  } = usePagedTableQuery<FindBookingsParams, FindBookingsResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'scheduledAt',
    ascending: false,
    search: undefined as string | undefined,
    status: undefined as BookingStatus | undefined,
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
  });

  const { data: bookingsData, isLoading } = useFindBookings({
    page: query.page,
    pageSize: query.pageSize,
    sortBy: query.sortBy,
    ascending: query.ascending,
    search: query.search || undefined,
    status: query.status || undefined,
    from: query.from || undefined,
    to: query.to || undefined,
  });

  const statusOptions = [
    { value: '', label: t('admin.bookings.filters.allStatuses') },
    { value: BookingStatus.Requested, label: t('admin.bookings.status.requested') },
    { value: BookingStatus.Confirmed, label: t('admin.bookings.status.confirmed') },
    { value: BookingStatus.Completed, label: t('admin.bookings.status.completed') },
    { value: BookingStatus.Cancelled, label: t('admin.bookings.status.cancelled') },
  ];

  const columns: PagedDataTableColumn<FindBookingsResponse>[] = [
    {
      accessor: 'clientName',
      title: t('admin.bookings.table.columns.client'),
      sortKey: 'clientName',
      render: (booking) => <Text fw={600} size="sm">{booking.clientName}</Text>,
    },
    {
      accessor: 'masterName',
      title: t('admin.bookings.table.columns.master'),
      sortKey: 'masterName',
      render: (booking) => <Text size="sm">{booking.masterName}</Text>,
    },
    {
      accessor: 'masterJobTitle',
      title: t('admin.bookings.table.columns.service'),
      render: (booking) => (
        <div>
          <Text size="sm">{booking.masterJobTitle}</Text>
          <Text size="xs" c="dimmed">{booking.masterJobCategoryName}</Text>
        </div>
      ),
    },
    {
      accessor: 'scheduledAt',
      title: t('admin.bookings.table.columns.scheduledAt'),
      sortKey: 'scheduledAt',
      render: (booking) => (
        <Text size="sm">
          {new Date(booking.scheduledAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      ),
    },
    {
      accessor: 'price',
      title: t('admin.bookings.table.columns.price'),
      sortKey: 'price',
      render: (booking) => (
        <Text size="sm" fw={600}>
          <NumberFormatter value={booking.price} prefix="€" decimalScale={2} fixedDecimalScale />
        </Text>
      ),
    },
    {
      accessor: 'status',
      title: t('admin.bookings.table.columns.status'),
      render: (booking) => (
        <Badge variant="light" color={STATUS_COLORS[booking.status]} radius="sm">
          {t(`admin.bookings.status.${booking.status.toLowerCase()}`)}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <AdminBookingsStats />

      <Card withBorder radius="md" p="lg">
        <Stack gap="lg">
          <Group gap="sm" wrap="wrap">
            <TextInput
              placeholder={t('admin.bookings.filters.searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              value={query.search ?? ''}
              onChange={(e) => onFilterChange('search', e.currentTarget.value || undefined)}
              radius="md"
              style={{ flex: 1, minWidth: 200 }}
            />
            <Select
              data={statusOptions}
              value={query.status ?? ''}
              onChange={(v) => onFilterChange('status', (v as BookingStatus) || undefined)}
              radius="md"
              style={{ minWidth: 160 }}
            />
            <DatePickerInput
              placeholder={t('admin.bookings.filters.fromDate')}
              value={query.from ? new Date(query.from) : null}
              onChange={(v) => onFilterChange('from', v ?? undefined)}
              radius="md"
              clearable
              style={{ minWidth: 160 }}
            />
            <DatePickerInput
              placeholder={t('admin.bookings.filters.toDate')}
              value={query.to ? new Date(query.to) : null}
              onChange={(v) => onFilterChange('to', v ?? undefined)}
              radius="md"
              clearable
              style={{ minWidth: 160 }}
            />
          </Group>

          <PagedDataTable<FindBookingsResponsePagedResponse, FindBookingsResponse>
            idAccessor="id"
            data={bookingsData}
            columns={columns}
            fetching={isLoading}
            onPageChange={onPageChange}
            onRecordsPerPageChange={onRecordsPerPageChange}
            sortStatus={sortStatus}
            onSortStatusChange={(s) => handleSortStatusChange(s, columns)}
            noRecordsText={t('admin.bookings.table.noRecords')}
          />
        </Stack>
      </Card>
    </>
  );
}
