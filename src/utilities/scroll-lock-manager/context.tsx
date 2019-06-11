import {createContext} from 'react';
import ScrollLockManager from './scroll-lock-manager';

const ScrollLockContext = createContext<ScrollLockManager | null>(null);

export default ScrollLockContext;
