import React from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

interface DevToolsContainerProps {
  children: React.ReactNode[] | React.ReactNode;
}

export default function DevtoolsContainer({ children }: DevToolsContainerProps) {
  const [visible, setVisible] = useLocalStorage({
    key: 'devtools-container-visible',
    defaultValue: true,
  });

  const toggleVisibility = () => setVisible((v) => !v);

  useHotkeys([
    ['mod+.', toggleVisibility],
    ['ctrl+.', toggleVisibility],
  ]);

  if (!visible) return null;

  return children;
}
