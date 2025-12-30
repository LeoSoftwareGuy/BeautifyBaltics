import {
  Group, Text, UnstyledButton,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconSelector } from '@tabler/icons-react';

import { useLayout } from '@/layouts';

import classes from './tenant-menu.module.css';

export default function TenantMenu() {
  const layout = useLayout();

  const handleOnClick = () => {
    modals.open({
      withCloseButton: false,
      centered: true,
      size: 'sm',
    });
  };

  return (
    <UnstyledButton onClick={handleOnClick} className={classes.button}>
      <Group gap="xs" align="center" wrap="nowrap" w="100%">
        {layout.navbar.collapsed ? null : (
          <Text fz="sm" truncate="end" lh={1} fw={700}>
            should be something
          </Text>
        )}
      </Group>
      {layout.navbar.collapsed ? null : <IconSelector size={16} />}
    </UnstyledButton>
  );
}
