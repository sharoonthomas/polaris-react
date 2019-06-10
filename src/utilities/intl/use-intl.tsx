import {useContext} from 'react';
import IntlContext from './context';

function useIntl() {
  const intl = useContext(IntlContext);

  return intl;
}

export default useIntl;
