import React from 'react';
import {mountWithContext} from 'test-utilities';

import {useScrollLockManager} from '../hooks';

describe('useScrollLockManager', () => {
  it('returns context', () => {
    function Component() {
      return useScrollLockManager() ? <div /> : null;
    }

    const component = mountWithContext(<Component />);

    expect(component).toContainReactComponent('div');
  });
});
