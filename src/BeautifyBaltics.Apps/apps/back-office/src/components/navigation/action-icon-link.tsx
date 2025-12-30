import * as React from 'react';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { createLink, CreateLinkProps, Link } from '@tanstack/react-router';

interface ActionIconLinkProps extends CreateLinkProps, ActionIconProps {
  children: React.ReactNode;
}

const ActionIconLink = createLink(
  React.forwardRef(
    (
      props: ActionIconLinkProps,
      ref: React.ForwardedRef<HTMLAnchorElement>,
    ) => (
      <ActionIcon {...props} ref={ref} component={Link}>{props.children}</ActionIcon>
    ),
  ),
);

export default ActionIconLink;
