import { useTranslation } from 'react-i18next';
import { AreaChart } from '@mantine/charts';
import {
  Badge,
  Box,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconExternalLink, IconMapPin, IconStar, IconTrash,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  getFindUsersQueryKey,
  getGetUserStatisticsQueryKey,
  useDeleteUser,
  useGetAdminUserDetail,
} from '@/state/endpoints/admin';
import { FindUsersResponse, UserRole } from '@/state/endpoints/api.schemas';

type Props = {
  user: FindUsersResponse;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function AdminUserDetailPanel({ user }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: detail, isLoading } = useGetAdminUserDetail(user.id);

  const { mutate: deleteUser } = useDeleteUser({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.users.notifications.deleted'), color: 'green' });
        queryClient.invalidateQueries({ queryKey: getFindUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserStatisticsQueryKey() });
      },
      onError: () => {
        notifications.show({ title: t('admin.users.notifications.errorTitle'), message: t('admin.users.notifications.error'), color: 'red' });
      },
    },
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: t('admin.users.deleteModal.title'),
      children: <Text size="sm">{t('admin.users.deleteModal.message', { name: user.fullName ?? user.email ?? '' })}</Text>,
      labels: { confirm: t('admin.users.deleteModal.confirm'), cancel: t('actions.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser({ id: user.id }),
    });
  };

  const chartData = (detail?.bookingHistory ?? []).map((entry) => ({
    month: MONTH_NAMES[(entry.month ?? 1) - 1],
    [t('admin.users.detail.chart.bookings')]: entry.count ?? 0,
    [t('admin.users.detail.chart.earnings')]: entry.earnings ?? 0,
  }));

  return (
    <Box p="md" bg="var(--mantine-color-gray-0)" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
      <Group align="flex-start" gap="xl" wrap="nowrap" style={{ flexDirection: 'row' }}>

        {/* Master profile info */}
        {user.role === UserRole.Master && (
          <Stack gap="sm" style={{ minWidth: 200, maxWidth: 280, flexShrink: 0 }}>
            <Title order={5} fw={600}>{t('admin.users.detail.profile.title')}</Title>
            {isLoading ? (
              <>
                <Skeleton height={16} width={120} />
                <Skeleton height={16} width={160} />
                <Skeleton height={40} />
              </>
            ) : (
              <>
                {detail?.rating != null && (
                  <Group gap={4}>
                    <IconStar size={14} color="var(--mantine-color-yellow-6)" />
                    <Text size="sm" fw={600}>{Number(detail.rating).toFixed(1)}</Text>
                  </Group>
                )}
                {detail?.city && (
                  <Group gap={4}>
                    <IconMapPin size={14} color="var(--mantine-color-gray-6)" />
                    <Text size="sm" c="dimmed">{detail.city}</Text>
                  </Group>
                )}
                {detail?.description && (
                  <Text size="sm" c="dimmed" lineClamp={3}>{detail.description}</Text>
                )}
                {(detail?.categories ?? []).length > 0 && (
                  <Group gap={4} wrap="wrap">
                    {(detail?.categories ?? []).map((cat) => (
                      <Badge key={cat} variant="light" color="brand" size="xs" radius="sm">{cat}</Badge>
                    ))}
                  </Group>
                )}
                {(detail?.services ?? []).length > 0 && (
                  <Group gap={4} wrap="wrap">
                    {(detail?.services ?? []).map((svc) => (
                      <Badge key={svc} variant="dot" color="gray" size="xs" radius="sm">{svc}</Badge>
                    ))}
                  </Group>
                )}
              </>
            )}
          </Stack>
        )}

        {/* Booking history chart */}
        <Stack gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Title order={5} fw={600}>{t('admin.users.detail.chart.title')}</Title>
          {isLoading ? (
            <Skeleton height={140} radius="md" />
          ) : (
            <AreaChart
              h={140}
              data={chartData}
              dataKey="month"
              series={[
                { name: t('admin.users.detail.chart.bookings'), color: 'brand.5' },
              ]}
              curveType="natural"
              withLegend={false}
              withDots={false}
            />
          )}
        </Stack>

        {/* Quick actions */}
        <Stack gap="sm" style={{ flexShrink: 0 }}>
          <Title order={5} fw={600}>{t('admin.users.detail.quickActions')}</Title>
          <Text size="xs" c="dimmed">
            {t('admin.users.detail.memberSince', {
              date: new Date(user.joinedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
            })}
          </Text>
          {user.role === UserRole.Master && detail?.masterProfileId && (
            <Button
              component="a"
              href={`/masters/${detail.masterProfileId}`}
              leftSection={<IconExternalLink size={14} />}
              variant="light"
              color="brand"
              size="xs"
            >
              {t('admin.users.detail.viewProfile')}
            </Button>
          )}
          <Button
            leftSection={<IconTrash size={14} />}
            variant="light"
            color="red"
            size="xs"
            onClick={handleDelete}
          >
            {t('admin.users.actions.delete')}
          </Button>
        </Stack>

      </Group>
    </Box>
  );
}
