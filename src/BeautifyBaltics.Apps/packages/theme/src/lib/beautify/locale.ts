import { LocaleConfig } from '../types';

const config: LocaleConfig = {
  dateTime: {
    timezone: 'Europe/Tallinn',
    formats: {
      date: 'DD.MM.YYYY',
      time: 'HH:mm',
      dateTime: 'DD.MM.YYYY HH:mm',
    },
  },
};

export default config;
