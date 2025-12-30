import { DatePickerPreset } from '@mantine/dates';
import dayjs, { Dayjs } from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';

const formatDate = (date: Dayjs): string => date.format(DATE_FORMAT);

type RangePreset = DatePickerPreset<'range'>;

interface PresetDefinition {
  label: string;
  getStart: (today: Dayjs) => Dayjs;
  getEnd: (today: Dayjs) => Dayjs;
}

const presetDefinitions: PresetDefinition[] = [
  {
    label: 'Today',
    getStart: (today) => today,
    getEnd: (today) => today,
  },
  {
    label: 'Last two days',
    getStart: (today) => today.subtract(2, 'day'),
    getEnd: (today) => today,
  },
  {
    label: 'Last 7 days',
    getStart: (today) => today.subtract(7, 'day'),
    getEnd: (today) => today,
  },
  {
    label: 'This month',
    getStart: (today) => today.startOf('month'),
    getEnd: (today) => today.endOf('month'),
  },
  {
    label: 'Last month',
    getStart: (today) => today.subtract(1, 'month').startOf('month'),
    getEnd: (today) => today.subtract(1, 'month').endOf('month'),
  },
  {
    label: 'This year',
    getStart: (today) => today.startOf('year'),
    getEnd: (today) => today.endOf('year'),
  },
  {
    label: 'Last year',
    getStart: (today) => today.subtract(1, 'year').startOf('year'),
    getEnd: (today) => today.subtract(1, 'year').endOf('year'),
  },
];

const today = dayjs();

export const presets: RangePreset[] = presetDefinitions.map(({ label, getStart, getEnd }) => ({
  label,
  value: [
    formatDate(getStart(today)),
    formatDate(getEnd(today)),
  ] as [string, string],
}));
