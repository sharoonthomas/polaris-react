import {useContext} from 'react';
import ScrollLockManagerContext from './context';

function useScrollLockManager() {
  const scrollLockManager = useContext(ScrollLockManagerContext);

  return scrollLockManager;
}

export default useScrollLockManager;
