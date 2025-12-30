import React, { Suspense } from 'react';
import {
  ActionIcon, Anchor, Button, ButtonVariant, Drawer, MantineSize,
} from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';

import useRoutedModal from '@/hooks/use-routed-modal';

export interface DrawerButtonContentProps {
  onCancel: () => Promise<void>;
}

interface DrawerButtonProps {
  title?: string | null;
  label?: string | null;
  id?: string | null;
  as?: 'button' | 'icon' | 'link';
  variant?: ButtonVariant;
  size?: MantineSize | `compact-${MantineSize}`;
  drawerSize?: MantineSize | number;
  icon?: typeof IconPencil;
  disabled?: boolean;
  render: (props: DrawerButtonContentProps) => React.ReactNode;
}

export default function DrawerButton({
  title,
  id,
  label,
  variant,
  drawerSize,
  size = 'sm',
  as = 'button',
  icon = IconPencil,
  disabled = false,
  render,
}: DrawerButtonProps) {
  const location = useLocation();

  let hash = label ?? title;
  if (id) hash = `${hash}-${id}`;
  hash = hash?.toLowerCase().replace(/\s/g, '-') ?? '';

  const { opened, onOpen, onClose } = useRoutedModal(hash);

  const renderButton = () => (
    <Button
      variant={variant}
      onClick={onOpen}
      size={size}
      disabled={disabled}
    >
      {label}
    </Button>
  );

  const renderLink = () => <Anchor href={`${location.href}#${hash}`}>{label}</Anchor>;

  const renderActionIcon = () => {
    const Icon = icon;
    return (
      <ActionIcon onClick={onOpen} size="sm" variant="default" color="gray" disabled={disabled}>
        <Icon />
      </ActionIcon>
    );
  };

  return (
    <>
      <Drawer opened={opened} onClose={onClose} title={title ?? label} size={drawerSize}>
        <Suspense fallback={null}>
          {opened ? render({ onCancel: onClose }) : null}
        </Suspense>
      </Drawer>
      {as === 'link' ? renderLink() : null}
      {as === 'button' ? renderButton() : null}
      {as === 'icon' ? renderActionIcon() : null}
    </>
  );
}
