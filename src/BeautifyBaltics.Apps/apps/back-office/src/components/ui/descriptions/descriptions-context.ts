import { createContext } from 'react';

import { DescriptionsConfiguration } from './types';

type DescriptionsContextType = DescriptionsConfiguration;

export const DescriptionsContext = createContext<DescriptionsContextType>({} as DescriptionsContextType);
