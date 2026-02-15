import { useTranslation } from 'react-i18next';
import { Badge, Input } from '@mantine/core';
import { useOs } from '@mantine/hooks';
import { spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';

export default function SearchInput() {
  const os = useOs();
  const { t } = useTranslation();

  return (
    <Input
      variant="filled"
      placeholder={t('megaSearch.placeholder')}
      leftSection={<IconSearch size={16} />}
      rightSection={(
        <Badge radius="xs" variant="subtle" c="gray">
          {os === 'macos' ? '⌘+K' : 'ctrl+K'}
        </Badge>
      )}
      rightSectionWidth={os === 'macos' ? 60 : 80}
      maw={350}
      onClick={spotlight.open}
    />
  );
}
