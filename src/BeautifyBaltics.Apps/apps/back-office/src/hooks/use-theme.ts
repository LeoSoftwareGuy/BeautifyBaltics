import { depowise, swedbank } from '@beautify-baltics-apps/theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

const themes: { [key: string]: typeof depowise } = {
  depowise,
  swedbank,
};

export function useTheme() {
  const [theme, setTheme] = useLocalStorage({
    key: 'theme',
    defaultValue: 'swedbank',
  });

  useHotkeys([
    ['mod + 1', () => setTheme('depowise')],
    ['mod + 2', () => setTheme('swedbank')],
  ]);

  return themes[theme];
}
