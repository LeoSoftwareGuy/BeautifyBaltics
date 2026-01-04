import {
  Badge, Card, Group, Stack, Text, Title,
} from '@mantine/core';

import type { Booking } from './master-tabs';

interface MasterBookingsPanelProps {
  bookings: Booking[];
}

export function MasterBookingsPanel({ bookings }: MasterBookingsPanelProps) {
  return (
    <Card withBorder>
      <Stack>
        <div>
          <Title order={3}>Upcoming Bookings</Title>
          <Text c="dimmed" fz="sm">Manage your appointments and client bookings</Text>
        </div>
        <Stack>
          {bookings.map((booking) => (
            <Group
              key={booking.id}
              justify="space-between"
              p="sm"
              bg="var(--mantine-color-default-hover)"
              style={{ borderRadius: 12, border: '1px solid var(--mantine-color-gray-3)' }}
            >
              <Stack gap={4}>
                <Text fw={600}>{booking.client}</Text>
                <Text c="dimmed" fz="sm">{booking.service}</Text>
              </Stack>
              <Group>
                <Stack gap={4} align="flex-end">
                  <Text fw={500}>{booking.time}</Text>
                  <Text c="dimmed" fz="sm">{booking.date}</Text>
                </Stack>
                <Badge variant={booking.status === 'confirmed' ? 'filled' : 'light'}>{booking.status}</Badge>
              </Group>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
