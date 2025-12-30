import { Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface DescriptionPopoverProps {
  description: string;
}

export default function DescriptionPopover({ description }: DescriptionPopoverProps) {
  const [opened, { close, open }] = useDisclosure(false);

  if (!description) return <Text>-</Text>;

  if (description.length <= 30) {
    return <Text inherit>{description}</Text>;
  }

  return (
    <Popover
      position="top"
      withArrow
      shadow="md"
      opened={opened}
      width={300}
      withinPortal={false}
    >
      <Popover.Target>
        <Text
          onMouseEnter={open}
          onMouseLeave={close}
          style={{ cursor: 'pointer' }}
          lineClamp={1}
          inherit
        >
          {description}
        </Text>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text inherit>{description}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
