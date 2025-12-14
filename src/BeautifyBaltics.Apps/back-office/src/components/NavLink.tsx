import { forwardRef } from 'react';
import { Link, LinkProps } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

type NavLinkProps = LinkProps & {
  className?: string;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ className, ...props }, ref) => (
  <Link
    ref={ref as never}
    className={cn('inline-flex items-center text-sm font-medium transition-colors', className)}
    {...props}
  />
));

NavLink.displayName = "NavLink";

export { NavLink };
