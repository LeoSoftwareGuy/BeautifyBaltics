import { Stack } from '@mantine/core';
import {
  IconAddressBook,
  IconBuildings,
  IconCalendarClock,
  IconCashBanknote,
  IconDashboard,
  IconLicense,
  IconMoneybag,
  IconReceipt,
} from '@tabler/icons-react';

import NavigationItem from './navigation-item';

export default function MainNavigation() {
  return (
    <Stack gap={4}>
      <NavigationItem icon={IconDashboard} label="Dashboard" href="/" />
      <NavigationItem
        icon={IconLicense}
        label="Share classes"
        href="/share-classes"
        subItems={[
          { label: 'Positions', href: '/share-classes/positions' },
          { label: 'Trades', href: '/share-classes/trades' },
        ]}
      />
      <NavigationItem icon={IconMoneybag} label="Funds" href="/funds" />
      <NavigationItem icon={IconCalendarClock} label="Capital events" href="/capital-events" />
      <NavigationItem
        icon={IconReceipt}
        label="Orders"
        href="/orders"
        subItems={[
          { label: 'Execution', href: '/orders/execution' },
        ]}
      />
      <NavigationItem
        icon={IconCashBanknote}
        label="Cash accounts"
        href="/cash-accounts"
        subItems={[
          { label: 'Transactions', href: '/cash-accounts/transactions' },
          { label: 'Payments', href: '/cash-accounts/payments' },
          { label: 'Reconciliation', href: '/cash-accounts/reconciliation' },
        ]}
      />
      <NavigationItem icon={IconBuildings} label="Asset Servicers" href="/companies" />
      <NavigationItem
        icon={IconAddressBook}
        label="Investors"
        href="/investors"
        subItems={[
          { label: 'KYCs', href: '/investors/kycs' },
        ]}
      />
    </Stack>
  );
}
