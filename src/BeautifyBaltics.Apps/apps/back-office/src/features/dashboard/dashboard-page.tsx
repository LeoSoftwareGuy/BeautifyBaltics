import { useEffect } from 'react';
import {
  Box, Center, Loader, Stack, Text,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import { ClientDashboardPage } from '@/features/client';
import { UserRole } from '@/state/endpoints/api.schemas';
import { useGetUser } from '@/state/endpoints/users';

function DashboardPage() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
  } = useGetUser();

  useEffect(() => {
    if (data?.role === UserRole.Master) {
      navigate({ to: '/master', replace: true });
    }
  }, [data?.role, navigate]);

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

  if (data.role === UserRole.Master) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  return <ClientDashboardPage />;
}

export default DashboardPage;
