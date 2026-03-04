import { useTranslation } from 'react-i18next';
import { Group, Select } from '@mantine/core';

import classes from './language-switcher.module.css';

const LANGUAGES = [
  { value: 'en', label: 'EN', description: 'English' },
  { value: 'et', label: 'EE', description: 'Eesti' },
  { value: 'ru', label: 'RU', description: 'Русский' },
] as const;

export interface LanguageSwitcherProps {
  compact?: boolean;
  variant?: 'dark' | 'light';
}

const themes = {
  dark: {
    inputBg: 'rgba(255,255,255,0.12)',
    border: 'rgba(255,255,255,0.35)',
    borderFocus: 'rgba(255,255,255,0.7)',
    text: '#ffffff',
    chevron: '#ffffff',
    dropdownBg: 'rgba(20,20,20,0.85)',
    dropdownBorder: 'rgba(255,255,255,0.15)',
    optionText: '#ffffff',
  },
  light: {
    inputBg: 'rgba(0,0,0,0.04)',
    border: 'rgba(0,0,0,0.15)',
    borderFocus: 'rgba(0,0,0,0.3)',
    text: '#1a1a1a',
    chevron: '#1a1a1a',
    dropdownBg: 'rgba(255,255,255,0.98)',
    dropdownBorder: 'rgba(0,0,0,0.1)',
    optionText: '#1a1a1a',
  },
};

export default function LanguageSwitcher({ compact, variant = 'dark' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;
  const c = themes[variant];

  const handleChange = (value: string) => {
    if (value === current) return;
    i18n.changeLanguage(value).catch(() => {});
  };

  return (
    <Group gap="xs" justify={compact ? 'center' : 'flex-start'}>
      <Select
        data={LANGUAGES.map(({ value, label }) => ({ value, label }))}
        value={current}
        onChange={(value) => { if (value) handleChange(value); }}
        aria-label={t('language.switcherLabel')}
        size="sm"
        w={compact ? 90 : 120}
        allowDeselect={false}
        classNames={{ option: variant === 'dark' ? classes.optionDark : classes.optionLight }}
        styles={{
          input: {
            border: `1.5px solid ${c.border}`,
            borderRadius: '999px',
            backgroundColor: c.inputBg,
            backdropFilter: 'blur(12px)',
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '0.04em',
            color: c.text,
            paddingLeft: '16px',
            paddingRight: '32px',
            height: '38px',
            minHeight: '38px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            '&:focus': {
              borderColor: c.borderFocus,
              outline: 'none',
            },
          },
          section: {
            paddingRight: '10px',
            color: c.chevron,
          },
          dropdown: {
            borderRadius: '16px',
            border: `1px solid ${c.dropdownBorder}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: '6px',
            backdropFilter: 'blur(12px)',
            backgroundColor: c.inputBg,
          },
          option: {
            borderRadius: '10px',
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '0.04em',
            color: c.optionText,
          },
        }}
      />
    </Group>
  );
}
