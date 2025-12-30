import {
  Box, Stack, Text, Title,
} from '@mantine/core';

interface PageTitleProps {
  title: string;
  status?: React.ReactNode;
  description?: React.ReactNode;
}

export default function PageTitle({ title, status, description }: PageTitleProps) {
  return (
    <Stack p="md" gap={0}>
      <Title order={4}>
        <span>{title}</span>
        <Box display="inline-flex" ml="md" h={6}>{status}</Box>
      </Title>
      <Text fz="sm" c="gray" component="span">{description}</Text>
    </Stack>
  );
}
