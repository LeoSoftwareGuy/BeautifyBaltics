import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon, Button, Divider, Group, Popover,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
  IconCalendarEvent, IconChevronDown, IconChevronLeft, IconChevronRight,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

import datetime from '@/utils/datetime';

interface DatePickerPopoverProps {
  initialValue?: string;
  onChange: (date?: Date) => void;
}

function DatePickerPopover({ initialValue, onChange }: DatePickerPopoverProps) {
  const [date, setDate] = useState(dayjs(initialValue).toString() ?? dayjs().toString());
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

  const handleDateOnChange = (nextDate: string | null) => {
    onChange(dayjs(nextDate).toDate() ?? undefined);
    setOpened(false);
  };

  const handleDateChange = (nextDate: dayjs.Dayjs) => {
    onChange(nextDate.toDate());
    setDate(nextDate.toString());
  };

  const handleOnPreviousClick = () => handleDateChange(dayjs(date).subtract(1, 'day'));
  const handleOnNextClick = () => handleDateChange(dayjs(date).add(1, 'day'));
  const handleOnTodayClick = () => handleDateChange(dayjs());

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      width={300}
      position="bottom"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Group gap="xs">
          <ActionIcon size="md" variant="default" onClick={handleOnPreviousClick}>
            <IconChevronLeft />
          </ActionIcon>
          <Button
            variant="default"
            size="xs"
            leftSection={<IconCalendarEvent size={16} />}
            rightSection={<IconChevronDown size={18} />}
            onClick={() => setOpened(!opened)}
          >
            {datetime.formatDate(initialValue ?? dayjs().toDate())}
          </Button>
          <ActionIcon size="md" variant="default" onClick={handleOnNextClick}>
            <IconChevronRight />
          </ActionIcon>
          <Divider orientation="vertical" my={2} />
          <Button size="xs" variant="default" onClick={handleOnTodayClick}>{t('general.today')}</Button>
        </Group>
      </Popover.Target>

      <Popover.Dropdown>
        <DatePicker
          date={date}
          onDateChange={setDate}
          size="sm"
          value={initialValue}
          onChange={handleDateOnChange}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export default DatePickerPopover;
