import React from 'react';
import {noop} from '@shopify/react-i18n/dist/utilities';
import {matchMedia} from '@shopify/jest-dom-mocks';
import {Button, Tag} from '@shopify/polaris';

import {
  mountWithAppContext,
  findById,
  trigger,
  findByTestID,
} from 'tests/utilities';

import ListFilters, {Props} from '../ListFilters';
import {ConnectedFilterControl} from '../components';

const MockFilter = (props: {id: string}) => <div id={props.id} />;
const mockProps: Props = {
  onSearchChange: noop,
  onSearchClear: noop,
  filters: [
    {
      key: 'filterOne',
      label: 'Filter One',
      filter: <MockFilter id="filterOne" />,
    },
    {
      key: 'filterTwo',
      label: 'Filter Two',
      filter: <MockFilter id="filterTwo" />,
    },
    {
      key: 'filterThree',
      label: 'Filter Three',
      filter: <MockFilter id="filterThree" />,
    },
  ],
};

describe('<ListFilters />', () => {
  describe('toggleFilters()', () => {
    it('opens the drawer on toggle button click', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} />,
      );

      trigger(findByTestID(listFilters, 'SheetToggleButton'), 'onClick');
      expect(listFilters.find(Sheet).props().open).toBe(true);
    });

    it('closes the drawer on second toggle button click', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} />,
      );

      trigger(findByTestID(listFilters, 'SheetToggleButton'), 'onClick');
      trigger(findByTestID(listFilters, 'SheetToggleButton'), 'onClick');

      expect(listFilters.find(Sheet).props().open).toBe(false);
    });

    describe('isMobile()', () => {
      beforeEach(() => {
        matchMedia.mock();
      });

      afterEach(() => {
        matchMedia.restore();
      });

      it('renders a drawer on desktop size with right origin', async () => {
        const listFilters = await mountWithAppContext(
          <ListFilters {...mockProps} />,
        );

        expect(listFilters.find(Sheet)).toExist();
        expect(listFilters.find(Sheet).props().origin).toBe(SheetOrigin.Right);
      });

      it('renders a drawer on mobile size with bottom origin', async () => {
        matchMedia.setMedia(() => ({matches: true}));
        const listFilters = await mountWithAppContext(
          <ListFilters {...mockProps} />,
        );

        expect(listFilters.find(Sheet)).toExist();
        expect(listFilters.find(Sheet).props().origin).toBe(SheetOrigin.Bottom);
      });

      it('opens the drawer at mobile size on toggle button click', async () => {
        matchMedia.setMedia(() => ({matches: true}));
        const listFilters = await mountWithAppContext(
          <ListFilters {...mockProps} />,
        );

        trigger(findByTestID(listFilters, 'SheetToggleButton'), 'onClick');
        expect(listFilters.find(Sheet).props().open).toBe(true);
      });

      it('closes the drawer at mobile size on second toggle button click', async () => {
        matchMedia.setMedia(() => ({matches: true}));
        const listFilters = await mountWithAppContext(
          <ListFilters {...mockProps} />,
        );

        trigger(findByTestID(listFilters, 'SheetToggleButton'), 'onClick');
        trigger(findByTestID(listFilters, 'SheetToggleButton'), 'onClick');

        expect(listFilters.find(Sheet).props().open).toBe(false);
      });
    });
  });

  describe('toggleFilter()', () => {
    it('opens the filter on toggle button click', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} />,
      );

      trigger(findById(listFilters, 'filterOneToggleButton'), 'onClick');

      expect(findById(listFilters, 'filterOneCollapsible').props().open).toBe(
        true,
      );
    });

    it('closes the filter on second toggle button click', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} />,
      );

      trigger(findById(listFilters, 'filterTwoToggleButton'), 'onClick');
      trigger(findById(listFilters, 'filterTwoToggleButton'), 'onClick');

      expect(findById(listFilters, 'filterTwoCollapsible').props().open).toBe(
        false,
      );
    });

    it('does not close other filters when a filter is toggled', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} />,
      );

      trigger(findById(listFilters, 'filterOneToggleButton'), 'onClick');
      trigger(findById(listFilters, 'filterThreeToggleButton'), 'onClick');

      expect(findById(listFilters, 'filterOneCollapsible').props().open).toBe(
        true,
      );
      expect(findById(listFilters, 'filterThreeCollapsible').props().open).toBe(
        true,
      );
    });
  });

  describe('<ConnectedFilterControl />', () => {
    const mockPropsWithShortcuts: Props = {
      onSearchChange: noop,
      onSearchClear: noop,
      filters: [
        {
          key: 'filterOne',
          label: 'Filter One',
          filter: <MockFilter id="filterOne" />,
          shortcut: true,
        },
        {
          key: 'filterTwo',
          label: 'Filter Two',
          filter: <MockFilter id="filterTwo" />,
        },
        {
          key: 'filterThree',
          label: 'Filter Three',
          filter: <MockFilter id="filterThree" />,
          shortcut: true,
        },
      ],
    };

    it('renders', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockPropsWithShortcuts} />,
      );

      expect(listFilters.find(ConnectedFilterControl).exists()).toBe(true);
    });

    it('receives the expected props when there are shortcut filters', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockPropsWithShortcuts} />,
      );

      expect(
        listFilters.find(ConnectedFilterControl).props()
          .rightPopoverableActions,
      ).toHaveLength(2);
    });

    it('receives the expected props when there are no shortcut filters', async () => {
      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} />,
      );

      expect(
        listFilters.find(ConnectedFilterControl).props()
          .rightPopoverableActions,
      ).toHaveLength(0);
    });
  });

  describe('appliedFilters', () => {
    it('calls remove callback when tag is clicked', async () => {
      const spy = jest.fn();
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: spy}];

      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} appliedFilters={appliedFilters} />,
      );

      const tag = listFilters.find(Tag).first();
      const removeButton = tag.find('button').first();

      trigger(removeButton, 'onClick');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('filterOne');
    });

    it('calls remove callback when clear button is clicked', async () => {
      const spy = jest.fn();
      const appliedFilters = [{key: 'filterOne', label: 'foo', onRemove: spy}];

      const listFilters = await mountWithAppContext(
        <ListFilters {...mockProps} appliedFilters={appliedFilters} />,
      );

      trigger(findById(listFilters, 'filterOneToggleButton'), 'onClick');
      const collapsible = findById(listFilters, 'filterOneCollapsible');
      const clearButton = collapsible.find(Button).last();

      trigger(clearButton, 'onClick');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('filterOne');
    });
  });
});
