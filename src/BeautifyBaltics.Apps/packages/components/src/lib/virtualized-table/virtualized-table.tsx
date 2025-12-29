import React, { useRef } from 'react';
import {
  LoadingOverlay, ScrollArea, Table, TableProps, Text,
} from '@mantine/core';
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual';
import { get } from 'es-toolkit/compat';

import classes from './VirtualizedTable.module.css';

export type VirtualizedTableColumn<T> = {
  title?: React.ReactNode;
  accessor: keyof T | (string & NonNullable<unknown>);
  textAlign?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (record: T, index: number) => React.ReactNode;
  footer?: React.ReactNode;
};

interface VirtualizedTableProps<T> {
  columns: VirtualizedTableColumn<T>[];
  data?: T[];
  fetching?: boolean;
  rowHeight: number;
  maxHeight: number;
  overscan?: number;
  tableProps?: TableProps;
}

export default function VirtualizedTable<T>({
  columns,
  data,
  fetching = false,
  rowHeight,
  maxHeight,
  overscan = 5,
  tableProps = {},
}: VirtualizedTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const [before, after] = items.length > 0
    ? [
      notUndefined(items[0]).start - virtualizer.options.scrollMargin,
      totalSize - notUndefined(items[items.length - 1]).end,
    ]
    : [0, 0];

  return (
    <ScrollArea
      viewportRef={scrollRef}
      h={maxHeight}
      mih={maxHeight}
      w="100%"
      pos="relative"
    >
      <LoadingOverlay visible={fetching} zIndex={100} />
      <Table {...tableProps} mih={maxHeight}>
        <Table.Thead className={classes.header} data-offset={before > 0}>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column.accessor.toString()} w={column.width} style={{ whiteSpace: 'nowrap' }}>
                {column.title}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {before > 0 && (
            <Table.Tr>
              <Table.Td colSpan={columns.length} h={before} />
            </Table.Tr>
          )}
          {data && items.map((item) => {
            const record = data[item.index];
            return (
              <Table.Tr key={item.key} style={{ maxHeight: rowHeight }}>
                {columns.map((column) => (
                  <Table.Td
                    key={column.accessor.toString()}
                    w={column.width}
                    style={{
                      height: rowHeight,
                      maxHeight: rowHeight,
                      textAlign: column.textAlign ?? 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.render ? column.render(record, item.index) : get(record, column.accessor)}
                  </Table.Td>
                ))}
              </Table.Tr>
            );
          })}
          {items.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} ta="center" bg="white">
                <Text inherit c="gray">No records</Text>
              </Table.Td>
            </Table.Tr>
          ) : null}
          {items.length !== 0 && items.length * rowHeight < maxHeight ? (
            <Table.Tr style={{ height: 'auto' }} bg="white">
              <Table.Td colSpan={columns.length} />
            </Table.Tr>
          ) : null}
          {after > 0 && (
            <Table.Tr>
              <Table.Td colSpan={columns.length} h={after} />
            </Table.Tr>
          )}
        </Table.Tbody>
        {columns.some((column) => column.footer) && (
          <Table.Tfoot className={classes.footer} data-offset={after > 0}>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Td
                  key={column.accessor.toString()}
                  miw={column.width}
                  style={{ textAlign: column.textAlign ?? 'left' }}
                >
                  {column.footer}
                </Table.Td>
              ))}
            </Table.Tr>
          </Table.Tfoot>
        )}
      </Table>
    </ScrollArea>
  );
}
