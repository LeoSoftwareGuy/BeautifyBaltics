import { LocaleConfig } from '@beautify-baltics-apps/theme';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const configure = (config: LocaleConfig) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(customParseFormat);
  dayjs.tz.setDefault(config.dateTime.timezone);
};

const locale = { configure };

export default locale;
