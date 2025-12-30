import {
  useCallback, useRef, useState,
} from 'react';
import { ScrollArea } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

interface InfiniteScrollAreaProps {
  onLoadMore:() => Promise<void>;
  hasMore: boolean;
  children: React.ReactNode;
}

export default function InfiniteScrollArea({ onLoadMore, hasMore, children }: InfiniteScrollAreaProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    const el = viewport.current;
    if (!el || el.scrollHeight <= el.clientHeight) return;

    // at bottom (with 200px tolerance)
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setIsLoading(true);
      onLoadMore()
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isLoading, hasMore, onLoadMore]);

  const onScroll = useThrottledCallback(() => handleLoadMore(), 200);

  return (
    <ScrollArea
      viewportRef={viewport}
      onScrollPositionChange={onScroll}
    >
      {children}
    </ScrollArea>
  );
}
