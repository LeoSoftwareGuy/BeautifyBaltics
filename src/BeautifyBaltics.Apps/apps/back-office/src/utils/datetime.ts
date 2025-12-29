import dayjs from 'dayjs';

import { swedbank } from '@beautify-baltics-apps/theme';

const { date, dateTime } = swedbank.locale.dateTime.formats;
const TIME_INPUT_FORMAT = 5; // HH:mm

const formatDate = (input: Date | string | undefined | null) => {
  if (!input) return '-';
  return dayjs(input).format(date);
};

const formatDateTime = (input: Date | null | undefined) => {
  if (!input) return '-';
  return dayjs(input).format(dateTime);
};

const toTimeInputValue = (input?: string | null) => {
  if (!input) return '';
  return input.slice(0, TIME_INPUT_FORMAT);
};

const toApiTimeValue = (input?: string | null) => {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;
  return trimmed.length === TIME_INPUT_FORMAT ? `${trimmed}:00` : trimmed;
};

const formatTime = (input?: string | null) => {
  if (!input) return '-';
  const trimmed = input.trim();
  if (trimmed === '') return '-';
  return trimmed.slice(0, TIME_INPUT_FORMAT);
};

const formatDateISO = (value: dayjs.ConfigType | dayjs.Dayjs) => dayjs(value).format('YYYY-MM-DD');

const datetime = {
  formatDate, formatDateTime, toTimeInputValue, toApiTimeValue, formatTime, isWeekend, getNextBusinessDay, formatDateISO,
};

export default datetime;
