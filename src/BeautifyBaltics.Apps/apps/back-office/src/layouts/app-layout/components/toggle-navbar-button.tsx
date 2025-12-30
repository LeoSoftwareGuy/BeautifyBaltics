import { ActionIcon, useMantineTheme } from '@mantine/core';
import { IconLayoutSidebar } from '@tabler/icons-react';

interface ToggleNavbarButtonProps {
  onClick: () => void;
}

export default function ToggleNavbarButton({ onClick }: ToggleNavbarButtonProps) {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      onClick={onClick}
      variant="subtle"
      color="gray.5"
    >
      <IconLayoutSidebar height={18} width={18} color={theme.black} />
    </ActionIcon>
  );
}
