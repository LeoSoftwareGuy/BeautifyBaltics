import {
  Button, Group, Stack, Title,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

function ClientDashboardHeader() {
  const navigate = useNavigate();

  return (
    <Group justify="space-between">
      <Group gap="md">
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate({ to: '/explore' })}
        />
        <Stack gap={0}>
          <Title order={2}>My Bookings</Title>
          <Title order={6} c="dimmed">Manage your appointments</Title>
        </Stack>
      </Group>
      <Button onClick={() => navigate({ to: '/explore' })}>Book New Appointment</Button>
    </Group>
  );
}

export default ClientDashboardHeader;
