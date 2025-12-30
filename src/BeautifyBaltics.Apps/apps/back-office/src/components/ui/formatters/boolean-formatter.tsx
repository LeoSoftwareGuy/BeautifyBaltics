interface BooleanFormatterProps {
  value?: boolean | null | undefined;
}

export default function BooleanFormatter({ value }: BooleanFormatterProps) {
  if (value === null || value === undefined) return '-';
  return value ? 'Yes' : 'No';
}
