import { JSX } from 'react';

declare module '@mantine/core' {
  export interface MantineThemeOther {
    favicon: string;
    logo: () => JSX.Element;
    backgroundColor: string;
    header: {
      height: number;
    };
    navbar: {
      width: number;
      collapsedWidth: number;
    };
    pageHeader: {
      height: number;
    };
  }
}
