import React from 'react';
import { NavLink, NavLinkProps } from '@mantine/core';
import { createLink, CreateLinkProps } from '@tanstack/react-router';

interface NavItemLinkProps extends CreateLinkProps, NavLinkProps {
  children: React.ReactNode;
}

const NavItemLink = createLink(
  React.forwardRef(
    (
      props: NavItemLinkProps,
      ref: React.ForwardedRef<HTMLAnchorElement>,
    ) => (
      <NavLink {...props} ref={ref}>{props.children}</NavLink>
    ),
  ),
);

export default NavItemLink;
