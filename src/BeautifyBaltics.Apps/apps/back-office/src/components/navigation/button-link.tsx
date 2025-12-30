import * as React from 'react';
import { Button, ButtonProps } from '@mantine/core';
import { createLink, CreateLinkProps, Link } from '@tanstack/react-router';

interface ButtonLinkProps extends CreateLinkProps, ButtonProps {
  children: React.ReactNode;
}

const ButtonLink = createLink(
  React.forwardRef(
    (
      props: ButtonLinkProps,
      ref: React.ForwardedRef<HTMLAnchorElement>,
    ) => (
      <Button {...props} ref={ref} component={Link}>{props.children}</Button>
    ),
  ),
);

export default ButtonLink;
