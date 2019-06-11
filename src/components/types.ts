import Intl from '../utilities/intl';
import {ThemeProviderContextType} from '../utilities/theme-provider';
import {AppProviderContextType} from './AppProvider';

export interface PolarisContext extends AppProviderContextType {
  intl: Intl;
  theme: ThemeProviderContextType;
}

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';
