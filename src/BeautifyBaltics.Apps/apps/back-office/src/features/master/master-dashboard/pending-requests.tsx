import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
} from '@mantine/core';

interface PendingRequest {
  id: string;
  clientName: string;
  clientType: string;
  service: string;
  date: string;
  description?: string;
}

const mockRequests: PendingRequest[] = [
  {
    id: '1',
    clientName: 'Mike Ross',
    clientType: 'Electrical Inspection',
    service: 'Electrical Inspection',
    date: 'Oct 24th',
    description: 'Need a quick safety check for a newly installed breaker panel.',
  },
  {
    id: '2',
    clientName: 'Elena Gilbert',
    clientType: 'Emergency Leakage',
    service: 'Emergency Leakage',
    date: 'Oct 25th',
  },
];

const totalPendingCount = 7;

export function PendingRequests() {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text fw={600} size="lg">Pending Requests</Text>
          <Badge variant="filled" color="brand" size="sm" circle>
            {totalPendingCount}
          </Badge>
        </Group>
      </Group>

      <Stack gap="md">
        {mockRequests.map((request, index) => (
          <div key={request.id}>
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="sm" wrap="nowrap">
                  <Avatar name={request.clientName} size="md" radius="xl" color="initials" />
                  <Stack gap={2}>
                    <Text fw={500} size="sm">{request.clientName}</Text>
                    <Text size="xs" c="dimmed">{request.clientType}</Text>
                  </Stack>
                </Group>
                <Stack gap={0} align="flex-end">
                  <Text size="sm" fw={500}>{request.date}</Text>
                  <Text size="xs" c="dimmed">Estimated fee</Text>
                </Stack>
              </Group>

              {request.description && (
                <Text size="sm" c="dimmed" fs="italic" px="xs">
                  &quot;
                  {request.description}
                  &quot;
                </Text>
              )}

              <Group gap="sm">
                <Button variant="filled" color="brand" size="xs" style={{ flex: 1 }}>
                  Confirm
                </Button>
                <Button variant="outline" color="gray" size="xs" style={{ flex: 1 }}>
                  Reschedule
                </Button>
              </Group>
            </Stack>

            {index < mockRequests.length - 1 && <Divider my="md" />}
          </div>
        ))}
      </Stack>

      <Divider my="md" />

      <Button variant="subtle" fullWidth color="gray">
        View
        {' '}
        {totalPendingCount - mockRequests.length}
        {' '}
        more requests
      </Button>
    </Card>
  );
}
