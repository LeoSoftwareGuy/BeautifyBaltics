import { beautify, depowise, swedbank } from '@beautify-baltics-apps/theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

const themes: { [key: string]: typeof beautify } = {
  beautify,
  depowise,
  swedbank,
};

export function useTheme() {
  const [theme, setTheme] = useLocalStorage({
    key: 'theme',
    defaultValue: 'beautify',
  });

  useHotkeys([
    ['mod + 1', () => setTheme('beautify')],
    ['mod + 2', () => setTheme('depowise')],
    ['mod + 3', () => setTheme('swedbank')],
  ]);

  return themes[theme] ?? beautify;
}
