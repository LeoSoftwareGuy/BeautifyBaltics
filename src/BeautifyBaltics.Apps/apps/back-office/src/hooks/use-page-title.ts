import { useEffect, useState } from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export default function usePageTitle() {
  const [title, setTitle] = useState('Beautify Baltics');
  const matches = useMatches();
  const { t } = useTranslation();

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
      const translatedTitle = breadcrumb
        .map((b) => (b?.titleKey ? t(b.titleKey) : ''))
        .filter(Boolean)
        .join(' · ');
      if (translatedTitle) {
        setTitle(translatedTitle);
      }
    });
  }, [matches, t]);

  return null;
}
