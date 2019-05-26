import React from 'react';

import {Popover, Button} from '@shopify/polaris';
import {mountWithAppContext, noop} from 'tests/utilities';

import ConnectedFilterControl, {
  PopoverableAction,
} from '../ConnectedFilterControl';

const MockChild = () => <div />;

const MockFilter = () => <div />;

const mockRightOpenPopoverableAction: PopoverableAction = {
  popoverOpen: true,
  popoverContent: MockFilter,
  key: 'openAction',
  content: 'Open action',
  onAction: noop,
};

const mockRightClosedPopoverableAction: PopoverableAction = {
  popoverOpen: false,
  popoverContent: MockFilter,
  key: 'closedAction',
  content: 'Closed action',
  onAction: noop,
};

const mockRightAction = <Button onClick={noop}>Right Action</Button>;

describe('<ConnectedFilterControl />', () => {
  it('mounts', () => {
    mountWithAppContext(
      <ConnectedFilterControl>
        <MockChild />
      </ConnectedFilterControl>,
    );
  });

  it('does not render buttons without right actions or right popoverable actions', async () => {
    const connectedFilterControl = await mountWithAppContext(
      <ConnectedFilterControl>
        <MockChild />
      </ConnectedFilterControl>,
    );

    expect(connectedFilterControl.find(Button)).not.toExist();
  });

  it('does not render popovers without right popoverable actions', async () => {
    const connectedFilterControl = await mountWithAppContext(
      <ConnectedFilterControl>
        <MockChild />
      </ConnectedFilterControl>,
    );

    expect(connectedFilterControl.find(Popover)).not.toExist();
  });

  it('does render a button with a right action', async () => {
    const connectedFilterControl = await mountWithAppContext(
      <ConnectedFilterControl rightAction={mockRightAction}>
        <MockChild />
      </ConnectedFilterControl>,
    );

    expect(connectedFilterControl.find(Button)).toExist();
  });

  it('does render a button with a popoverable action', async () => {
    const connectedFilterControl = await mountWithAppContext(
      <ConnectedFilterControl
        rightPopoverableActions={[mockRightOpenPopoverableAction]}
      >
        <MockChild />
      </ConnectedFilterControl>,
    );

    expect(connectedFilterControl.find(Button)).toHaveLength(1);
  });

  it('renders three buttons with two popoverable actions and a right action', async () => {
    const connectedFilterControl = await mountWithAppContext(
      <ConnectedFilterControl
        rightPopoverableActions={[
          mockRightOpenPopoverableAction,
          mockRightClosedPopoverableAction,
        ]}
        rightAction={mockRightAction}
      >
        <MockChild />
      </ConnectedFilterControl>,
    );

    expect(connectedFilterControl.find(Button)).toHaveLength(3);
  });
});
