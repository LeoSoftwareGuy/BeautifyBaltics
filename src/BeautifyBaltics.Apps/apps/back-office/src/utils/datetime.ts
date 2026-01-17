import { beautify } from '@beautify-baltics-apps/theme';
import dayjs from 'dayjs';

const { date, dateTime } = beautify.locale.dateTime.formats;
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

const formatTimeFromDate = (input: Date | string): string => dayjs(input).format('HH:mm');

const createDateTimeFromDateAndTime = (dateS: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  return dayjs(dateS).hour(hours).minute(minutes).second(0)
    .millisecond(0)
    .toDate();
};

const isSameDay = (date1: Date | string, date2: Date): boolean => dayjs(date1).isSame(dayjs(date2), 'day');

const formatTimeSlot = (startAt: Date, endAt: Date): string => {
  const startLabel = dayjs(startAt).format('HH:mm');
  const endLabel = dayjs(endAt).format('HH:mm');
  return `${startLabel} - ${endLabel}`;
};

const datetime = {
  formatDate,
  formatDateTime,
  toTimeInputValue,
  toApiTimeValue,
  formatTime,
  formatDateISO,
  formatTimeFromDate,
  createDateTimeFromDateAndTime,
  isSameDay,
  formatTimeSlot,
};

export default datetime;
