import { useTranslation } from 'react-i18next';
import { Group, Select } from '@mantine/core';

const LANGUAGES = [
  { value: 'en', label: 'EN', description: 'English' },
  { value: 'et', label: 'EE', description: 'Eesti' },
  { value: 'ru', label: 'RU', description: 'Русский' },
] as const;

export interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  const handleChange = (value: string) => {
    if (value === current) return;
    i18n.changeLanguage(value).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Unable to switch language', error);
    });
  };

  return (
    <Group gap="xs" justify={compact ? 'center' : 'flex-start'}>
      <Select
        data={LANGUAGES.map(({ value, label }) => ({ value, label }))}
        size="sm"
        value={current}
        onChange={(value) => { if (value) { handleChange(value); } }}
        aria-label={t('language.switcherLabel')}
        w={compact ? '100%' : 120}
      />
    </Group>
  );
}
