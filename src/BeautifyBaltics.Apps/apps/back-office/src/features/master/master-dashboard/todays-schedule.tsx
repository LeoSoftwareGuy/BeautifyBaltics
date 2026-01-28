import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

interface ScheduleItem {
  id: string;
  time: string;
  clientName: string;
  service: string;
  location: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed';
}

const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    time: '09:00 AM',
    clientName: 'John Doe',
    service: 'Kitchen Pipe Repair',
    location: 'Brooklyn, NY',
    duration: '1.5 Hours',
    status: 'confirmed',
  },
  {
    id: '2',
    time: '01:30 PM',
    clientName: 'Sarah Smith',
    service: 'Bathroom Tile Grouting',
    location: 'Queens, NY',
    duration: '2.0 Hours',
    status: 'confirmed',
  },
];

const emptySlots = ['04:00 PM'];

function getStatusColor(status: ScheduleItem['status']) {
  switch (status) {
    case 'confirmed':
      return 'brand';
    case 'pending':
      return 'yellow';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
}

export function TodaysSchedule() {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Today&apos;s Schedule</Text>
        <Anchor component={Link} to="/master/time-slots" size="sm" c="brand">
          View Calendar
        </Anchor>
      </Group>

      <Timeline active={-1} bulletSize={12} lineWidth={2}>
        {mockSchedule.map((item) => (
          <Timeline.Item
            key={item.id}
            bullet={<Box w={8} h={8} bg="brand" style={{ borderRadius: '50%' }} />}
          >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Text size="sm" c="dimmed" w={60}>
                {item.time}
              </Text>
              <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="xs" wrap="nowrap">
                    <Avatar name={item.clientName} size="sm" radius="xl" color="initials" />
                    <Text fw={500} size="sm">{item.clientName}</Text>
                  </Group>
                  <Badge
                    variant="light"
                    color={getStatusColor(item.status)}
                    size="sm"
                    tt="uppercase"
                  >
                    {item.status}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">{item.service}</Text>
                <Group gap="md">
                  <Group gap={4}>
                    <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                    <Text size="xs" c="dimmed">{item.location}</Text>
                  </Group>
                  <Group gap={4}>
                    <IconClock size={14} color="var(--mantine-color-dimmed)" />
                    <Text size="xs" c="dimmed">{item.duration}</Text>
                  </Group>
                </Group>
              </Stack>
            </Group>
            <Divider my="sm" />
          </Timeline.Item>
        ))}

        {emptySlots.map((time) => (
          <Timeline.Item
            key={time}
            bullet={<Box w={8} h={8} bg="gray.3" style={{ borderRadius: '50%' }} />}
          >
            <Group gap="md">
              <Text size="sm" c="dimmed" w={60}>
                {time}
              </Text>
              <Group gap="xs">
                <Box w={8} h={8} bg="gray.3" style={{ borderRadius: '50%' }} />
                <Text size="sm" c="dimmed">No bookings scheduled</Text>
              </Group>
            </Group>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
}
