import {createContext} from 'react';
import Intl from './Intl';

const IntlContext = createContext<Intl>(new Intl({}));

export default IntlContext;
