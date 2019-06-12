import * as React from 'react';
import styles from '../../Tabs.scss';

export interface Props {
  id: string;
  tabID: string;
  children?: React.ReactNode;
}

/** @uxpinnamespace Tabs */
export default function Panel({id, tabID, children}: Props) {
  return (
    <div
      className={styles.Panel}
      id={id}
      role="tabpanel"
      aria-labelledby={tabID}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
