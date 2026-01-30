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

const toDate = (value: Date | string | null | undefined): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

const minutesToTimeSpan = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
};

/**
 * Format an hour number (0-23) to 12-hour AM/PM format
 */
const formatHour = (hour: number): string => {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

/**
 * Parse a time string (HH:mm) to total minutes from midnight
 */
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

/**
 * Get an array of 7 dates for a week starting from the given date (Monday-based)
 */
const getWeekDates = (startDate: Date): Date[] => {
  const start = dayjs(startDate).startOf('week').add(1, 'day'); // Monday
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day').toDate());
};

/**
 * Format a week range as a human-readable string
 */
const formatWeekRange = (weekStart: Date): string => {
  const start = dayjs(weekStart);
  const end = start.add(6, 'day');
  if (start.month() === end.month()) {
    return `${start.format('MMM D')} — ${end.format('D, YYYY')}`;
  }
  return `${start.format('MMM D')} — ${end.format('MMM D, YYYY')}`;
};

/**
 * Check if a date is today
 */
const isToday = (inputDate: Date | string): boolean => dayjs(inputDate).isSame(dayjs(), 'day');

/**
 * Check if a date is tomorrow
 */
const isTomorrow = (inputDate: Date | string): boolean => dayjs(inputDate).isSame(dayjs().add(1, 'day'), 'day');

/**
 * Calculate minutes difference between a date and now
 */
const minutesFromNow = (inputDate: Date | string): number => dayjs(inputDate).diff(dayjs(), 'minute');

/**
 * Format minutes into hours and minutes (e.g., "2H 30M")
 */
const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}H ${minutes}M`;
};

const HOURS = Array.from({ length: 17 }, (_, i) => i + 7); // 07:00 - 23:00
const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

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
  toDate,
  minutesToTimeSpan,
  formatHour,
  parseTimeToMinutes,
  getWeekDates,
  formatWeekRange,
  isToday,
  isTomorrow,
  minutesFromNow,
  formatDuration,
  HOURS,
  DAYS_OF_WEEK,
};

export default datetime;
