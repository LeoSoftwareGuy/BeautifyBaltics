import React from 'react';
import {
  AreaChart, BarChart, DonutChart, FunnelChart,
} from '@mantine/charts';
import {
  Accordion,
  ActionIcon,
  AppShell,
  Autocomplete, Badge, Button,
  createTheme,
  Drawer, FileInput, Group,
  Kbd,
  MantineThemeOverride,
  NavLink,
  NumberInput, Paper,
  rem,
  ScrollArea,
  Select,
  Table,
  Tabs, Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { Spotlight } from '@mantine/spotlight';
import { RichTextEditor } from '@mantine/tiptap';
import { IconX } from '@tabler/icons-react';
import { TooltipProps } from 'recharts/types/component/Tooltip';

import AccordionClasses from './styles/Accordion.module.css';
import ActionIconClasses from './styles/ActionIcon.module.css';
import AppShellClasses from './styles/AppShell.module.css';
import ButtonModuleClasses from './styles/Button.module.css';
import DatePickerInputClasses from './styles/DatePickerInput.module.css';
import DonutChartClasses from './styles/DonutChart.module.css';
import DrawerClasses from './styles/Drawer.module.css';
import DropzoneClasses from './styles/Dropzone.module.css';
import InputClasses from './styles/Input.module.css';
import KbdClasses from './styles/Kbd.module.css';
import ModalClasses from './styles/Modal.module.css';
import NavLinkClasses from './styles/NavLink.module.css';
import RichTextEditorClasses from './styles/RichTextEditor.module.css';
import ScrollAreaClasses from './styles/ScrollArea.module.css';
import SpotlightClasses from './styles/Spotlight.module.css';
import TableClasses from './styles/Table.module.css';
import TabsClasses from './styles/Tabs.module.css';
import ThemeIconClasses from './styles/ThemeIcon.module.css';

const inputDefaultProps = {
  inputWrapperOrder: ['label', 'input', 'error', 'description'],
};

const theme: MantineThemeOverride = createTheme({
  components: {
    Accordion: Accordion.extend({
      classNames: AccordionClasses,
    }),
    ActionIcon: ActionIcon.extend({
      classNames: ActionIconClasses,
    }),
    Anchor: {
      defaultProps: {
        fz: 'sm',
      },
    },
    AppShell: {
      ...AppShell.extend({
        classNames: AppShellClasses,
      }),
    },
    AreaChart: AreaChart.extend({
      defaultProps: {
        tooltipProps: {
          content: ({ payload, coordinate }: TooltipProps<any, any>) => {
            if (!payload || !coordinate || payload.length === 0) return null;
            return (
              <Paper bg="dark" p="xs" maw={260}>
                {payload.map((item) => (
                  <Group wrap="nowrap" key={item.name}>
                    <Text fz="sm" c="white" truncate="end">{item.name}</Text>
                    <Text fz="sm" c="white" fw={700}>{item.value}</Text>
                  </Group>
                ))}
              </Paper>
            );
          },
        },
      },
    }),
    Autocomplete: {
      ...Autocomplete.extend({
        classNames: InputClasses,
      }),
      defaultProps: inputDefaultProps,
    },
    Badge: Badge.extend({
      styles: {
        label: {
          overflow: 'visible',
        },
      },
    }),
    BarChart: BarChart.extend({
      defaultProps: {
        barProps: {
          radius: 4,
        },
        tooltipProps: {
          content: ({ payload, coordinate }: TooltipProps<any, any>) => {
            if (!payload || !coordinate || payload.length === 0) return null;
            return (
              <Paper bg="dark" p="xs" maw={260}>
                {payload.map((item) => (
                  <Group wrap="nowrap" key={item.name}>
                    <Text fz="sm" c="white" truncate="end">{item.name}</Text>
                    <Text fz="sm" c="white" fw={700}>{item.value}</Text>
                  </Group>
                ))}
              </Paper>
            );
          },
        },
      },
    }),
    Button: Button.extend({
      classNames: ButtonModuleClasses,
    }),
    DateInput: {
      ...DateInput.extend({
        classNames: InputClasses,
      }),
      defaultProps: {
        highlightToday: true,
      },
    },
    DatePicker: {
      defaultProps: {
        highlightToday: true,
      },
    },
    DatePickerInput: {
      ...DatePickerInput.extend({
        classNames: DatePickerInputClasses,
      }),
      defaultProps: {
        ...inputDefaultProps,
        highlightToday: true,
      },
    },
    Divider: {
      styles: {
        label: {
          color: 'var(--mantine-colors-gray)',
        },
      },
    },
    DonutChart: DonutChart.extend({
      classNames: DonutChartClasses,
      defaultProps: {
        w: '100%',
        paddingAngle: 4,
        pieProps: {
          cornerRadius: 4,
        },
        tooltipProps: {
          content: ({ payload, coordinate }: TooltipProps<any, any>) => {
            if (!payload || !coordinate || payload.length === 0) return null;
            return (
              <Paper bg="dark" p="xs" maw={260}>
                <Group wrap="nowrap">
                  <Text fz="sm" c="white" truncate="end">{payload[0].name}</Text>
                  <Text fz="sm" c="white" fw={700}>{payload[0].value}</Text>
                </Group>
              </Paper>
            );
          },
        },
      },
    }),
    Drawer: Drawer.extend({
      classNames: DrawerClasses,
      defaultProps: {
        position: 'right',
        closeOnClickOutside: false,
        scrollAreaComponent: ScrollArea.Autosize,
        overlayProps: {
          blur: 7,
          color: 'rgba(0, 0, 0, 0.35)',
        },
        closeButtonProps: {
          icon: (
            <ThemeIcon variant="default">
              <IconX />
            </ThemeIcon>
          ),
        },
      },
    }),
    Dropzone: Dropzone.extend({
      classNames: DropzoneClasses,
    }),
    FileInput: {
      ...FileInput.extend({
        classNames: {
          root: InputClasses.root,
          label: InputClasses.label,
        },
        styles: {
          input: {
            paddingTop: rem(22),
          },
        },
      }),
      defaultProps: inputDefaultProps,
    },
    FunnelChart: FunnelChart.extend({
      defaultProps: {
        funnelProps: {
          radius: 4,
        },
        tooltipProps: {
          content: ({ payload, coordinate }: TooltipProps<any, any>) => {
            if (!payload || !coordinate || payload.length === 0) return null;
            return (
              <Paper bg="dark" p="xs" maw={260}>
                {payload.map((item) => (
                  <Group wrap="nowrap" key={item.name}>
                    <Text fz="sm" c="white" truncate="end">{item.payload.name}</Text>
                    <Text fz="sm" c="white" fw={700}>{item.value}</Text>
                  </Group>
                ))}
              </Paper>
            );
          },
        },
      },
    }),
    InputBase: {
      defaultProps: inputDefaultProps,
    },
    Kbd: Kbd.extend({
      classNames: KbdClasses,
    }),
    Loader: {
      defaultProps: {
        type: 'dots',
      },
    },
    Menu: {
      defaultProps: {
        transitionProps: { transition: 'pop', duration: 150 },
      },
    },
    Modal: {
      classNames: ModalClasses,
      defaultProps: {
        centered: true,
        overlayProps: {
          blur: 7,
          color: 'rgba(0, 0, 0, 0.35)',
        },
        scrollAreaComponent: ScrollArea.Autosize,
        closeButtonProps: {
          icon: (
            <ThemeIcon variant="default">
              <IconX />
            </ThemeIcon>
          ),
        },
      },
    },
    MultiSelect: {
      defaultProps: inputDefaultProps,
      classNames: {
        root: InputClasses.root,
        label: InputClasses.label,
      },
      styles: {
        pillsList: {
          paddingTop: rem(18),
        },
      },
    },
    NavLink: {
      ...NavLink.extend({
        classNames: NavLinkClasses,
      }),
    },
    NumberFormatter: {
      defaultProps: {
        thousandSeparator: ' ',
        style: { whiteSpace: 'nowrap' },
      },
    },
    NumberInput: {
      ...NumberInput.extend({
        classNames: InputClasses,
      }),
      defaultProps: inputDefaultProps,
    },
    RichTextEditor: RichTextEditor.extend({
      classNames: RichTextEditorClasses,
    }),
    ScrollArea: ScrollArea.extend({
      classNames: ScrollAreaClasses,
    }),
    Select: {
      ...Select.extend({
        classNames: InputClasses,
      }),
      defaultProps: inputDefaultProps,
    },
    Spotlight: Spotlight.extend({
      classNames: SpotlightClasses,
    }),
    Table: Table.extend({
      classNames: TableClasses,
    }),
    Tabs: Tabs.extend({
      classNames: TabsClasses,
    }),
    TextInput: {
      ...TextInput.extend({
        classNames: InputClasses,
      }),
      defaultProps: inputDefaultProps,
    },
    Textarea: {
      classNames: {
        root: InputClasses.root,
        label: InputClasses.label,
      },
      styles: {
        input: {
          paddingTop: rem(26),
        },
      },
    },
    ThemeIcon: ThemeIcon.extend({
      classNames: ThemeIconClasses,
    }),
    TimeInput: {
      ...TimeInput.extend({
        classNames: InputClasses,
      }),
      defaultProps: inputDefaultProps,
    },
    Tooltip: {
      defaultProps: {
        color: 'brand',
      },
    },
  },
  white: '#fff',
  primaryColor: 'brand',
  primaryShade: 6,
  other: {
    navbar: {
      width: 240,
      collapsedWidth: 72,
    },
    header: {
      height: 68,
    },
    pageHeader: {
      height: 56,
    },
  },
});

export default theme;
