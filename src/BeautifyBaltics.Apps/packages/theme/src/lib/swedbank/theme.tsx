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
        c: '#31a3ae',
      },
    },
  },
  black: '#512b2b',
  colors: {
    brand: [
      '#ffefe4',
      '#ffddcd',
      '#ffbb9b',
      '#ff9564',
      '#fe7637',
      '#fe621a',
      '#ff5709',
      '#e44600',
      '#cb3d00',
      '#b13200',
    ],
    red: [
      '#ffeaec',
      '#fbd4d6',
      '#f4a5aa',
      '#ef747a',
      '#eb4b52',
      '#e83238',
      '#e8252b',
      '#ce181f',
      '#b8111a',
      '#a20314',
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
