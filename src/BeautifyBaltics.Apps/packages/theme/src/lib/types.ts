type DateTimeConfig = {
  timezone: string;
  formats: {
    date: string;
    time: string;
    dateTime: string;
  }
};

export type LocaleConfig = {
  dateTime: DateTimeConfig;
};
