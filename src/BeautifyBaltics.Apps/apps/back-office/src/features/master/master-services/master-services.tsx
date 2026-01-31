import {
  Alert, Loader, Stack, Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { useGetUser } from '@/state/endpoints/users';

import { MasterServicesList } from './master-services-list/master-services-list';

export function MasterServices() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const masterId = user?.id ?? '';

  if (isUserLoading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="lg" />
        <Text c="dimmed">Loading...</Text>
      </Stack>
    );
  }

  if (!masterId) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        Failed to load user data. Please try again later.
      </Alert>
    );
  }

  return <MasterServicesList masterId={masterId} />;
}
