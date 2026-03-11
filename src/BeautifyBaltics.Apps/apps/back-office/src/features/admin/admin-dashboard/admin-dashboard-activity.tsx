import { useTranslation } from 'react-i18next';
import {
  Badge,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { DashboardRecentActivity } from '@/state/endpoints/api.schemas';

const STATUS_COLORS: Record<string, string> = {
  Completed: 'green',
  Confirmed: 'blue',
  Cancelled: 'red',
  Requested: 'yellow',
};

type Props = {
  data: DashboardRecentActivity[] | null | undefined;
  isLoading: boolean;
};

function ActivityRow({ item }: { item: DashboardRecentActivity }) {
  const { t } = useTranslation();
  const date = item.bookedAt ?? new Date();
  const timeAgo = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const statusColor = item.status ? (STATUS_COLORS[item.status] ?? 'gray') : 'gray';

  return (
    <Group justify="space-between" wrap="nowrap" gap="md">
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" fw={600} truncate>
          {item.clientName}
          {' '}
          <Text span fw={400} c="dimmed">{t('admin.dashboard.recentActivity.booked')}</Text>
          {' '}
          {item.serviceName}
        </Text>
        <Text size="xs" c="dimmed">
          {timeAgo}
          {' · '}
          {t('admin.dashboard.recentActivity.with')}
          {' '}
          {item.masterName}
        </Text>
      </Stack>
      <Stack gap={4} align="flex-end" style={{ flexShrink: 0 }}>
        <Text size="sm" fw={700}>
          €
          {(item.price ?? 0).toFixed(2)}
        </Text>
        <Badge variant="light" color={statusColor} radius="sm" size="xs">
          {item.status}
        </Badge>
      </Stack>
    </Group>
  );
}

function ActivityContent({ data, t }: { data: DashboardRecentActivity[]; t: (key: string) => string }) {
  if (!data.length) {
    return <Text c="dimmed" size="sm">{t('admin.dashboard.recentActivity.noActivity')}</Text>;
  }
  return (
    <Stack gap={0}>
      {data.map((item, i) => (
        <div key={`${item.bookedAt}-${item.clientName}`}>
          {i > 0 && <Divider my="md" />}
          <ActivityRow item={item} />
        </div>
      ))}
    </Stack>
  );
}

export function AdminDashboardActivity({ data, isLoading }: Props) {
  const { t } = useTranslation();
  const items = data ?? [];

  return (
    <Card withBorder radius="md" p="lg" style={{ flex: 1 }}>
      <Stack gap="md">
        <Title order={3} fw={600}>{t('admin.dashboard.recentActivity.title')}</Title>

        {isLoading ? (
          <Stack gap="md">
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={i} height={52} radius="md" />
            ))}
          </Stack>
        ) : (
          <ActivityContent data={items} t={t} />
        )}
      </Stack>
    </Card>
  );
}
