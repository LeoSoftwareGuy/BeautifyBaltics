import {
  ActionIcon,
  Box,
  Container,
  Group,
  Text,
  TextInput,
} from '@mantine/core';
import { Filter, Search } from 'lucide-react';

type ExploreHeaderProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
};

function ExploreHeader({ onOpenFilters, onSearchChange, searchValue }: ExploreHeaderProps) {
  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      bg="var(--mantine-color-body)"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <Container size="lg" py="md">
        <Group gap="lg" align="center" wrap="nowrap">
          <Text fw={700} fz="xl">Beautify Baltics</Text>
          <TextInput
            placeholder="Search by service, master, or location..."
            leftSection={<Search size={16} />}
            radius="xl"
            flex={1}
            value={searchValue}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
          />
          <ActionIcon
            variant="outline"
            radius="xl"
            onClick={onOpenFilters}
          >
            <Filter size={18} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
}

export default ExploreHeader;
