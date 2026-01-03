import {
  Box, Center, Loader, Stack, Text,
} from '@mantine/core';

import { ClientDashboardPage } from '@/features/client';
import { useGetUser } from '@/state/endpoints/users';

import MasterDashboardPage from '../master/master-dashboard-page';

function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useGetUser();

  if (isLoading) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Box px="xl" py="xl">
        <Stack align="center" gap="sm">
          <Text fw={600}>Unable to load your dashboard.</Text>
          <Text c="dimmed">Please try again later.</Text>
        </Stack>
      </Box>
    );
  }

  if (data.role === 'master') {
    return <MasterDashboardPage />;
  }

  return <ClientDashboardPage />;
}

export default DashboardPage;
