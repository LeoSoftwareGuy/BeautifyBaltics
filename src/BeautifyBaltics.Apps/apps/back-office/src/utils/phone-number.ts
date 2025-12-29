import parsePhoneNumber, { isPossiblePhoneNumber } from 'libphonenumber-js';

const formatInternational = (phoneNumber: string) => {
  const parsed = parsePhoneNumber(phoneNumber);
  return parsed?.formatInternational();
};

const getURI = (phoneNumber: string) => {
  const parsed = parsePhoneNumber(phoneNumber);
  return parsed?.getURI();
};

const isValid = (phoneNumber: string) => isPossiblePhoneNumber(phoneNumber);

const phoneNumber = { formatInternational, getURI, isValid };

export default phoneNumber;
