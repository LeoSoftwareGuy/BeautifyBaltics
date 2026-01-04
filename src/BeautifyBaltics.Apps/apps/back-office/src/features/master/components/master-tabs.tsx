import { useState } from 'react';
import {
  Card, Tabs,
} from '@mantine/core';

import { MasterBookingsPanel } from './master-bookings-panel';
import { MasterPortfolioPanel } from './master-portfolio';
import MasterProfileSettings from './master-profile-settings';
import { MasterSchedulePanel } from './master-schedule-panel';

export type Booking = {
  id: number;
  client: string;
  service: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending';
};

interface MasterTabsProps {
  bookings: Booking[];
  selectedDate: Date | null;
  onDateChange: (value: Date | null) => void;
  slotInput: string;
  onSlotInputChange: (value: string) => void;
  slots: string[];
  onAddSlot: () => void;
  onRemoveSlot: (time: string) => void;
}

export function MasterTabs({
  bookings,
  selectedDate,
  onDateChange,
  slotInput,
  onSlotInputChange,
  slots,
  onAddSlot,
  onRemoveSlot,
}: MasterTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('bookings');

  return (
    <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
      <Tabs.List>
        <Tabs.Tab value="bookings">Bookings</Tabs.Tab>
        <Tabs.Tab value="schedule">Schedule</Tabs.Tab>
        <Tabs.Tab value="portfolio">Portfolio</Tabs.Tab>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="bookings" pt="xl">
        <MasterBookingsPanel bookings={bookings} />
      </Tabs.Panel>

      <Tabs.Panel value="schedule" pt="xl">
        <MasterSchedulePanel
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          slotInput={slotInput}
          onSlotInputChange={onSlotInputChange}
          slots={slots}
          onAddSlot={onAddSlot}
          onRemoveSlot={onRemoveSlot}
        />
      </Tabs.Panel>

      <Tabs.Panel value="portfolio" pt="xl">
        <MasterPortfolioPanel />
      </Tabs.Panel>

      <Tabs.Panel value="profile" pt="xl">
        <Card>
          <MasterProfileSettings />
        </Card>
      </Tabs.Panel>
    </Tabs>
  );
}
