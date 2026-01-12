import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Clock } from 'lucide-react';

type Service = {
  id: string;
  name: string;
  duration?: string;
  price?: number;
};

type ServicesListProps = {
  services: Service[];
};

function ServicesList({ services }: ServicesListProps) {
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
                <Text>{service.duration ?? 'Duration not specified'}</Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default ServicesList;
