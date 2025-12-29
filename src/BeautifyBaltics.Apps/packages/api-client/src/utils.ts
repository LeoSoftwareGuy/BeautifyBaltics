// convert string values that match ISO 8601 format to JavaScript Date's
const convertDates = (body: any) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  // Matches ISO 8601 date-time
  const isoDateTimeFormat = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):?[0-5]\d)?$/;

  const isIsoDateString = (value: unknown) => typeof value === 'string' && isoDateTimeFormat.test(value);

  Object.entries(body).forEach(([key, value]) => {
    if (typeof value === 'string' && isIsoDateString(value)) {
      const date = new Date(value);

      if (isValidDate(date)) {
        // eslint-disable-next-line no-param-reassign
        body[key] = date;
      }
    } else if (typeof value === 'object') {
      convertDates(value);
    }
  });

  return body;
};

const isValidDate = (value: Date) => value instanceof Date && !Number.isNaN(+value);

const utils = { convertDates };

export default utils;
