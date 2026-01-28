import { beautify } from '@beautify-baltics-apps/theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

const themes: { [key: string]: typeof beautify } = {
  beautify,
};

export function useTheme() {
  const [theme, setTheme] = useLocalStorage({
    key: 'theme',
    defaultValue: 'beautify',
  });

  useHotkeys([
    ['mod + 1', () => setTheme('beautify')],
  ]);

  return themes[theme] ?? beautify;
}
