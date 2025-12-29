import { useEffect, useState } from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { useMatches } from '@tanstack/react-router';

export default function usePageTitle() {
  const [title, setTitle] = useState('Beautify Baltics');
  const matches = useMatches();

  useDocumentTitle(title);

  useEffect(() => {
    const breadcrumbPromises = [...matches]
      .flatMap((match) => {
        if (!match || !match.context) return undefined;
        return [...match.context.breadcrumbs];
      })
      .filter((b) => b !== undefined)
      .reverse();

    Promise.all(breadcrumbPromises).then((breadcrumb) => {
      if (!breadcrumb) return;
      const t = breadcrumb.map((b) => b.title).join(' · ');
      setTitle(t);
    });
  }, [matches]);

  return null;
}
