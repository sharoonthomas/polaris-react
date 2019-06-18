import {createContext} from 'react';
import {Intl} from './intl';

export const IntlContext = createContext(new Intl({}));
