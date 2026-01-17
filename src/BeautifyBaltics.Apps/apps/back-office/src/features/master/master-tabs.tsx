import { useState } from 'react';
import {
  Card, Tabs,
} from '@mantine/core';

import { MasterTreatments } from './master-treatments/master-treatments';
import { MasterBookingsDataTable } from './master-bookings-data-table';
import MasterProfileSettings from './master-profile-settings';
import { MasterSchedule } from './master-schedule';

export function MasterTabs() {
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
        <MasterBookingsDataTable />
      </Tabs.Panel>

      <Tabs.Panel value="schedule" pt="xl">
        <MasterSchedule />
      </Tabs.Panel>

      <Tabs.Panel value="portfolio" pt="xl">
        <MasterTreatments />
      </Tabs.Panel>

      <Tabs.Panel value="profile" pt="xl">
        <Card>
          <MasterProfileSettings />
        </Card>
      </Tabs.Panel>
    </Tabs>
  );
}
