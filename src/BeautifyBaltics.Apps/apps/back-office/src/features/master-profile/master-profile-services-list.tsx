import { useMemo } from 'react';
import {
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Clock } from 'lucide-react';

import { useFindMasterJobs } from '@/state/endpoints/masters';

type ServicesListProps = {
  masterId: string;
};

function MasterServicesList({ masterId }: ServicesListProps) {
  const { data, isLoading } = useFindMasterJobs(masterId);

  const services = useMemo(() => {
    if (!data?.jobs) return [];

    return data.jobs.map((job) => ({
      id: job.id,
      name: job.title,
      duration: `${job.durationMinutes} min`,
      price: job.price,
    }));
  }, [data?.jobs]);

  if (isLoading) {
    return (
      <Stack gap="lg" mt="xl">
        <Title order={2}>Services & Pricing</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {[1, 2].map((i) => (
            <Skeleton key={i} height={80} radius="lg" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  if (services.length === 0) {
    return (
      <Stack gap="lg" mt="xl">
        <Title order={2}>Services & Pricing</Title>
        <Text c="dimmed">This master has not shared any services yet.</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" mt="xl">
      <Title order={2}>Services & Pricing</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {services.map((service) => (
          <Card key={service.id} withBorder radius="lg">
            <Stack gap={4}>
              <Group justify="space-between">
                <Text fw={600}>{service.name}</Text>
                <Text fw={700} c="grape.6">
                  {typeof service.price === 'number' ? `$${service.price}` : 'Ask for price'}
                </Text>
              </Group>
              <Group gap="xs" c="dimmed" fz="sm">
                <Clock size={14} />
                <Text>{service.duration}</Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default MasterServicesList;
