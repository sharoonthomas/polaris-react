import React from 'react';
import {mountWithContext} from 'test-utilities';

import {useIntl} from '../hooks';

describe('useIntl', () => {
  it('returns context', () => {
    function Component() {
      return useIntl() ? <div /> : null;
    }

    const component = mountWithContext(<Component />, {});

    expect(component).toContainReactComponent('div');
  });
});
