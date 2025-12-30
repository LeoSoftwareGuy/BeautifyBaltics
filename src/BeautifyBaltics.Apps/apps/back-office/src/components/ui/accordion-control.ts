import React from 'react';
import {
  Accordion, AccordionControlProps, Center, Flex, rem,
} from '@mantine/core';

export default function AccordionControl({ action, ...props }: AccordionControlProps & { action?: React.ReactNode }) {
  return (
    <Flex pos= "relative" >
    <Accordion.Control { ...props } />
    <Flex pos="absolute" right = { 0} top = { 0} h = "100%" w = { rem(36) } >
      <Center>{ action } </Center>
      </Flex>
      </Flex>
  );
}
