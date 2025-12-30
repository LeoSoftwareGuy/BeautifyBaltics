import * as React from 'react';
import { Anchor, AnchorProps } from '@mantine/core';
import { createLink, CreateLinkProps } from '@tanstack/react-router';

interface AnchorLinkProps extends CreateLinkProps, AnchorProps {
  children: React.ReactNode;
}

const AnchorLink = createLink(
  React.forwardRef(
    (
      props: AnchorLinkProps,
      ref: React.ForwardedRef<HTMLAnchorElement>,
    ) => (
      <Anchor {...props} ref={ref}>{props.children}</Anchor>
    ),
  ),
);

export default AnchorLink;
