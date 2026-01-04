import { useMemo, useState } from 'react';
import {
  Box, Button, Group, Stack, Title,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import { MasterStatsGrid } from './components/master-stats-grid';
import { MasterTabs } from './components/master-tabs';

const defaultBookings = [
  {
    id: 1, client: 'Sarah Johnson', service: 'Haircut', time: '10:00 AM', date: 'Today', status: 'confirmed',
  },
  {
    id: 2, client: 'Mike Brown', service: 'Beard Trim', time: '2:00 PM', date: 'Today', status: 'confirmed',
  },
  {
    id: 3, client: 'Emma Davis', service: 'Hair Color', time: '11:00 AM', date: 'Tomorrow', status: 'pending',
  },
];

function MasterDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [slotInput, setSlotInput] = useState('');
  const [slotsByDay, setSlotsByDay] = useState<Record<string, string[]>>({
    [new Date().toDateString()]: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  });

  const dateKey = selectedDate?.toDateString();
  const slots = useMemo(() => (dateKey ? slotsByDay[dateKey] ?? [] : []), [dateKey, slotsByDay]);

  const handleAddSlot = () => {
    if (!dateKey || !slotInput) return;
    const nextSlots = slots.includes(slotInput) ? slots : [...slots, slotInput].sort();
    setSlotsByDay((prev) => ({ ...prev, [dateKey]: nextSlots }));
    setSlotInput('');
  };

  const handleRemoveSlot = (time: string) => {
    if (!dateKey) return;
    setSlotsByDay((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).filter((slot) => slot !== time),
    }));
  };

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Group justify="space-between">
          <Title order={2}>Master Dashboard</Title>
          <Button leftSection={<IconSettings size={16} />}>Settings</Button>
        </Group>
      </Box>

      <Stack gap="xl" px="md" pb="xl">
        <MasterStatsGrid />
        <MasterTabs
          bookings={defaultBookings}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          slotInput={slotInput}
          onSlotInputChange={setSlotInput}
          slots={slots}
          onAddSlot={handleAddSlot}
          onRemoveSlot={handleRemoveSlot}
        />
      </Stack>
    </Box>
  );
}

export default MasterDashboardPage;
