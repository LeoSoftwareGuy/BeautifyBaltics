import { Flex, useMantineTheme } from '@mantine/core';

export default function Logo() {
  const theme = useMantineTheme();

  const Component = theme.other.logo;

  return (
    <Flex align="center" justify="center" h={40} w={40}>
      <Component />
    </Flex>
  );
}
