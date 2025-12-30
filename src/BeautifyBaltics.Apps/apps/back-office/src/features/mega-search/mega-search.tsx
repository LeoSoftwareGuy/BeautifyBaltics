import { useState } from 'react';
import {
  Card, rem, useMantineTheme,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import {
  Spotlight, spotlight,
} from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';

import KbdCommands from './kbd-commands';
import SearchInput from './search-input';

export default function MegaSearch() {
  const theme = useMantineTheme();

  const [focused, setFocused] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  useHotkeys([['mod+K', spotlight.open], ['ctrl+K', spotlight.open]]);

  return (
    <>
      <SearchInput />
      <Spotlight.Root
        scrollable
        maxHeight={480}
        onQueryChange={setSearchTerm}
        returnFocus={false}
        styles={{ content: { backgroundColor: 'transparent', height: 'auto', marginBottom: rem(20) } }}
      >
        <Card
          flex="0 0 auto"
          radius="sm"
          p={0}
          withBorder
          style={focused ? {
            borderColor: theme.colors[theme.primaryColor][theme.primaryShade as number],
            boxShadow: `0 0 4px ${theme.colors[theme.primaryColor][theme.primaryShade as number]}`,
          } : {}}
        >
          <Spotlight.Search
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search..."
            value={searchTerm ?? ''}
            leftSection={<IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
          />
          <Spotlight.Footer py="xs" px="xs" bg="gray.1">
            <KbdCommands />
          </Spotlight.Footer>
        </Card>
      </Spotlight.Root>
    </>
  );
}
