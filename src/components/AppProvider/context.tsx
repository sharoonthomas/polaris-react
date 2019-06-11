import React from 'react';
import {ClientApplication} from '@shopify/app-bridge';
import Link from '../../utilities/unstyled-link';
import createPolarisContext from './utilities/createPolarisContext';
import {StickyManager} from './utilities';

export interface AppProviderContextType {
  link: Link;
  stickyManager: StickyManager;
  appBridge?: ClientApplication<{}>;
}

const AppProviderContext = React.createContext<AppProviderContextType>(
  createPolarisContext(),
);

export default AppProviderContext;
