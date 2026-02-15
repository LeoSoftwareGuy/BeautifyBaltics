import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Translates pre-seeded category/service names using locale files.
 * Falls back to the original value for custom master-created names.
 */
export function useTranslateData() {
  const { t } = useTranslation();

  const translateCategory = useCallback(
    (name: string) => {
      const key = `data.categories.${name}`;
      const translated = t(key);
      return translated === key ? name : translated;
    },
    [t],
  );

  const translateService = useCallback(
    (name: string) => {
      const key = `data.services.${name}`;
      const translated = t(key);
      return translated === key ? name : translated;
    },
    [t],
  );

  return { translateCategory, translateService };
}
