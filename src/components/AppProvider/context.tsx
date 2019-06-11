import React from 'react';
import {ClientApplication} from '@shopify/app-bridge';
import createPolarisContext from './utilities/createPolarisContext';
import {Link, StickyManager} from './utilities';

export interface AppProviderContextType {
  link: Link;
  stickyManager: StickyManager;
  appBridge?: ClientApplication<{}>;
}

const AppProviderContext = React.createContext<AppProviderContextType>(
  createPolarisContext(),
);

export default AppProviderContext;
