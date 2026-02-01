import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';

import { GetPendingRequestsResponse } from '@/state/endpoints/api.schemas';

interface MasterDashboardPendingRequestsProps {
  data?: GetPendingRequestsResponse;
  isLoading?: boolean;
  isConfirming?: boolean;
  isCancelling?: boolean;
  onConfirm?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}

export function MasterDashboardPendingRequests({
  data, isLoading, isConfirming, isCancelling, onConfirm, onCancel,
}: MasterDashboardPendingRequestsProps) {
  const requests = data?.requests ?? [];
  const totalCount = data?.totalCount ?? 0;
  const displayedCount = requests.length;
  const remainingCount = totalCount - displayedCount;

  if (isLoading) {
    return (
      <Card withBorder radius="md" p="lg" h="100%">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Text fw={600} size="lg">Pending Requests</Text>
            <Skeleton width={24} height={24} circle />
          </Group>
        </Group>
        <Stack gap="md">
          {[1, 2].map((i) => (
            <Stack key={i} gap="sm">
              <Group justify="space-between">
                <Group gap="sm">
                  <Skeleton width={40} height={40} circle />
                  <Stack gap={2}>
                    <Skeleton width={100} height={16} />
                    <Skeleton width={80} height={12} />
                  </Stack>
                </Group>
                <Skeleton width={60} height={16} />
              </Group>
              <Group gap="sm">
                <Skeleton width="48%" height={28} />
                <Skeleton width="48%" height={28} />
              </Group>
              {i < 2 && <Divider my="md" />}
            </Stack>
          ))}
        </Stack>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card withBorder radius="md" p="lg" h="100%">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Text fw={600} size="lg">Pending Requests</Text>
            <Badge variant="filled" color="gray" size="sm" circle>
              0
            </Badge>
          </Group>
        </Group>
        <Text c="dimmed" ta="center" py="xl">No pending requests</Text>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text fw={600} size="lg">Pending Requests</Text>
          <Badge variant="filled" color="brand" size="sm" circle>
            {totalCount}
          </Badge>
        </Group>
      </Group>

      <Stack gap="md">
        {requests.map((request, index) => (
          <div key={request.id}>
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="sm" wrap="nowrap">
                  <Avatar name={request.clientName} size="md" radius="xl" color="initials" />
                  <Stack gap={2}>
                    <Text fw={500} size="sm">{request.clientName}</Text>
                    <Text size="xs" c="dimmed">{request.masterJobTitle}</Text>
                  </Stack>
                </Group>
                <Stack gap={0} align="flex-end">
                  <Text size="sm" fw={500}>
                    {dayjs(request.scheduledAt).format('MMM D')}
                  </Text>
                  <Text size="xs" c="dimmed">
                    $
                    {request.price.toFixed(2)}
                  </Text>
                </Stack>
              </Group>

              <Group gap="sm">
                <Button
                  variant="filled"
                  color="brand"
                  size="xs"
                  style={{ flex: 1 }}
                  loading={isConfirming}
                  disabled={isCancelling}
                  onClick={() => onConfirm?.(request.id)}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="xs"
                  style={{ flex: 1 }}
                  loading={isCancelling}
                  disabled={isConfirming}
                  onClick={() => onCancel?.(request.id)}
                >
                  Decline
                </Button>
              </Group>
            </Stack>

            {index < requests.length - 1 && <Divider my="md" />}
          </div>
        ))}
      </Stack>

      {remainingCount > 0 && (
        <>
          <Divider my="md" />
          <Button variant="subtle" fullWidth color="gray">
            View
            {' '}
            {remainingCount}
            {' '}
            more requests
          </Button>
        </>
      )}
    </Card>
  );
}
