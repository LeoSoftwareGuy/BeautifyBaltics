import { createTheme, MantineThemeOverride } from '@mantine/core';
import dayjs from 'dayjs';

import base from '../base/theme';

import locale from './locale';
import Logo from './logo';

const serifFont = '"Playfair Display", "Times New Roman", serif';
const sansFont = '"InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fbd0db" />
      <stop offset="0.5" stop-color="#e77487" />
      <stop offset="1" stop-color="#b53d54" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="url(#grad)" />
  <path d="M23 14h14c7 0 12 3.9 12 10s-4.5 9.4-11.2 10.6C45 35.7 49 39.4 49 46s-5.6 11.8-14.1 11.8H23z" fill="#fff4f5"/>
</svg>
`;

const favicon = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

const theme: MantineThemeOverride = createTheme({
  ...base,
  fontFamily: sansFont,
  headings: {
    ...(base.headings ?? {}),
    fontFamily: serifFont,
    fontWeight: '600',
  },
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
        c: '#d05072',
        fw: 600,
      },
    },
  },
  black: '#2a2522',
  colors: {
    ...(base.colors ?? {}),
    brand: [
      '#fff4f7',
      '#ffdce6',
      '#ffb8cb',
      '#ff90ae',
      '#ff7399',
      '#e85f83',
      '#d05072',
      '#b54361',
      '#963751',
      '#6f283b',
    ],
    blush: [
      '#fdf6f1',
      '#fbe7dc',
      '#f6cbbc',
      '#efaf9f',
      '#e99885',
      '#d47d67',
      '#b96553',
      '#9c5446',
      '#81463b',
      '#523025',
    ],
  },
  primaryColor: 'brand',
  primaryShade: 5,
  other: {
    ...base.other,
    favicon,
    backgroundColor: '#f9f7f5',
    logo: Logo,
  },
});

export default theme;
