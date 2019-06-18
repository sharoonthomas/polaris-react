import {useContext} from 'react';
import {IntlContext} from './context';

export function useIntl() {
  return useContext(IntlContext);
}
