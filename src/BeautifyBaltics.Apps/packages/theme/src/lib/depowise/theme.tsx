import { createTheme, MantineThemeOverride } from '@mantine/core';
import dayjs from 'dayjs';

import base from '../base/theme';

import favicon from './favicon.ico';
import locale from './locale';
import Logo from './logo';

const theme: MantineThemeOverride = createTheme({
  ...base,
  components: {
    ...base.components,
    DateInput: {
      ...base.components?.DateInput,
      defaultProps: {
        ...base.components?.DateInput?.defaultProps,
        valueFormat: locale.dateTime.formats.date,
        dateParser: (value: string) => dayjs(value, locale.dateTime.formats.date).toDate(),
      },
    },
    DatePickerInput: {
      ...base.components?.DatePickerInput,
      defaultProps: {
        ...base.components?.DatePickerInput?.defaultProps,
        valueFormat: locale.dateTime.formats.date,
      },
    },
    Anchor: {
      ...base.components?.Anchor,
      defaultProps: {
        ...base.components?.Anchor?.defaultProps,
        c: '#78038b',
      },
    },
  },
  black: '#512b2b',
  colors: {
    brand: [
      '#8D00A2',
      '#79008A',
      '#670076',
      '#580065',
      '#4B0056',
      '#40004A',
      '#37003F',
      '#2E0034',
      '#26002B',
      '#1F0024',
      '#1A001E',
    ],
  },
  other: {
    ...base.other,
    favicon,
    backgroundColor: '#fff',
    logo: Logo,
  },
});

export default theme;
