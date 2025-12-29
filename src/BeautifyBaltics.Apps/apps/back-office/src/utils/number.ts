const formatNumber = (value: number, decimalScale: number) => new Intl.NumberFormat('en-US', {
  minimumFractionDigits: decimalScale,
  maximumFractionDigits: decimalScale,
  useGrouping: true,
}).format(value).replace(/,/g, ' ');

const number = { formatNumber };

export default number;
