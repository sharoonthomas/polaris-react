import Intl from '../utilities/intl';
import {AppProviderContextType} from './AppProvider';
import {ThemeProviderContextType} from './ThemeProvider';

export interface PolarisContext extends AppProviderContextType {
  intl: Intl;
  theme: ThemeProviderContextType;
}

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';
