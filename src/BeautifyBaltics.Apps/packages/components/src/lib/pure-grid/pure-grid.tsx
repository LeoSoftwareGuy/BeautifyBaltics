import { MantineSpacing, rem } from '@mantine/core';

interface PureGridProps {
  children: React.ReactNode;
  width?: number | string;
  gap?: MantineSpacing;
}

export default function PureGrid({ children, width = 220, gap = 'sm' }: PureGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${rem(width)}, 1fr))`,
        gap: `var(--mantine-spacing-${gap})`,
      }}
    >
      {children}
    </div>
  );
}
