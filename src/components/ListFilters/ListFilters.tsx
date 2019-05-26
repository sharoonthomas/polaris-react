import React from 'react';

import {classNames} from '@shopify/css-utilities';
import {focusFirstFocusableNode} from '@shopify/javascript-utilities/focus';
import debounce from 'lodash/debounce';
import {withAppProvider, WithAppProviderProps} from '../AppProvider';
import Button from '../Button';
import DisplayText from '../DisplayText';
import Collapsible from '../Collapsible';
import Scrollable from '../Scrollable';
import ScrollLock from '../ScrollLock';
import Icon from '../Icon';
import TextField from '../TextField';
import Tag from '../Tag';
import EventListener from '../EventListener';
import TextStyle from '../TextStyle';
import Badge from '../Badge';
import Focus from '../Focus';
import Sheet from '../Sheet';
import Stack from '../Stack';
import {Key} from '../../types';

import {navigationBarCollapsed} from '../../utilities/breakpoints';
import {ConnectedFilterControl, PopoverableAction} from './components';

import styles from './ListFilters.scss';

export interface AppliedFilter {
  key: string;
  label: string;
  onRemove(key: string): void;
}

export interface Filter {
  key: string;
  label: string;
  filter: React.ReactNode;
  shortcut?: boolean;
}

export interface Props {
  // Currently entered text in the query field
  queryValue?: string;
  // Placeholder text for the query field
  queryPlaceholder?: string;
  // Whether the query field is focused
  focused?: boolean;
  // Available filters added to the drawer. Shortcut filters are exposed outside of the drawer.
  filters?: Filter[];
  // Applied filters which are rendered as tags. The remove callback is called with the respective key
  appliedFilters?: AppliedFilter[];
  // Action docked to the right of the query field and shortcut filters
  filtersAction?: React.ReactNode;
  // Action docked to the right of the filters action
  sortAction?: React.ReactNode;
  // Callback when the query field is blurred
  onQueryBlur?(): void;
  // Callback when the query field is changed
  onQueryChange(queryValue: string): void;
  // Callback when the clear button is triggered
  onQueryClear(): void;
  // Callback when the reset all button is pressed
  onResetAll?(): void;
}

type ComposedProps = Props & WithAppProviderProps;

interface State {
  // Whether or not the drawer is open. We will also derive this state from props
  open: boolean;
  // Whether or not we are at a mobile viewport width
  mobile: boolean;
  // Computed state for whether or not the respective filter `Collapsible` is
  // expanded within the drawer and whether or not the respective shortcut
  // filter popover is active
  [key: string]: boolean;
}

enum Suffix {
  Filter = 'Filter',
  Shortcut = 'Shortcut',
}

class ListFilters extends React.Component<ComposedProps, State> {
  state: State = {
    open: false,
    mobile: false,
  };

  private moreFiltersButtonContainer = React.createRef<HTMLDivElement>();

  private get hasAppliedFilters(): boolean {
    const {appliedFilters, queryValue} = this.props;
    const filtersApplied = Boolean(appliedFilters && appliedFilters.length > 0);
    const queryApplied = Boolean(queryValue && queryValue !== '');

    return filtersApplied || queryApplied;
  }

  private handleResize = debounce(
    () => {
      const {mobile} = this.state;
      if (mobile !== isMobile()) {
        this.setState({mobile: !mobile, open: false});
      }
    },
    40,
    {leading: true, trailing: true, maxWait: 40},
  );

  componentDidMount() {
    const {mobile} = this.state;
    if (mobile !== isMobile()) {
      this.setState({mobile: !mobile});
    }
  }

  render() {
    const {
      filters,
      queryValue,
      onQueryBlur,
      onQueryChange,
      focused,
      onResetAll,
      appliedFilters,
      filtersAction,
      sortAction,
      polaris: {intl},
      onQueryClear,
      queryPlaceholder,
    } = this.props;
    const {open, mobile} = this.state;

    const backdropMarkup = open ? (
      <React.Fragment>
        <ScrollLock />
        <div
          className={styles.Backdrop}
          onClick={this.closeFilters}
          testID="Backdrop"
        />
      </React.Fragment>
    ) : null;

    const filtersContentMarkup = filters
      ? filters.map((filter, index) => {
          const filterIsOpen =
            this.state[`${filter.key}${Suffix.Filter}`] === true;
          const icon = filterIsOpen ? 'chevronUp' : 'chevronDown';
          const className = classNames(
            styles.FilterTriggerContainer,
            filterIsOpen && styles.open,
            index === 0 && styles.first,
            index === filters.length - 1 && styles.last,
          );

          const appliedFilterContent = this.getAppliedFilterContent(filter.key);
          const appliedFilterBadgeMarkup = appliedFilterContent ? (
            <div className={styles.AppliedFilterBadgeContainer}>
              <Badge size="small" status="new">
                {appliedFilterContent}
              </Badge>
            </div>
          ) : null;

          const collapsibleID = `${filter.key}Collapsible`;

          return (
            <div key={filter.key} className={className}>
              <button
                onClick={() => this.toggleFilter(filter.key)}
                className={styles.FilterTrigger}
                id={`${filter.key}ToggleButton`}
                type="button"
                aria-controls={collapsibleID}
                aria-expanded={filterIsOpen}
              >
                <div className={styles.FilterTriggerLabelContainer}>
                  <h2 className={styles.FilterTriggerTitle}>
                    {filter.label ? filter.label : filter.key}
                  </h2>
                  <span className={styles.FilterTriggerIcon}>
                    <Icon source={icon} color="inkLightest" />
                  </span>
                </div>
                {appliedFilterBadgeMarkup}
              </button>
              <Collapsible id={collapsibleID} open={filterIsOpen}>
                <div className={styles.FilterNodeContainer}>
                  <Focus disabled={!filterIsOpen}>
                    {this.generateFilterMarkup(filter)}
                  </Focus>
                </div>
              </Collapsible>
            </div>
          );
        })
      : null;

    const rightActionMarkup = filters ? (
      <div ref={this.moreFiltersButtonContainer}>
        <Button onClick={this.toggleFilters} testID="SheetToggleButton">
          {intl.translate('Polaris.ListFilters.moreFilters')}
        </Button>
      </div>
    ) : null;

    const filtersControlMarkup = (
      <ConnectedFilterControl
        rightPopoverableActions={this.transformFilters(filters)}
        rightAction={rightActionMarkup}
        filtersAction={filtersAction}
        sortAction={sortAction}
      >
        <TextField
          placeholder={
            queryPlaceholder ||
            intl.translate('Polaris.ListFilters.filter', {
              resourceName: 'TODO get from resource list context',
            })
          }
          onChange={onQueryChange}
          onBlur={onQueryBlur}
          value={queryValue}
          focused={focused}
          label={
            queryPlaceholder ||
            intl.translate('Polaris.ListFilters.filter', {
              resourceName: 'TODO get from resource list context',
            })
          }
          labelHidden
          prefix={
            <span className={styles.SearchIcon}>
              <Icon source="search" />
            </span>
          }
          clearButton
          onClearButtonClick={onQueryClear}
        />
      </ConnectedFilterControl>
    );

    const filtersDesktopHeaderMarkup = (
      <div className={styles.FiltersContainerHeader}>
        <DisplayText size="small">
          {intl.translate('Polaris.ListFilters.moreFilters')}
        </DisplayText>
        <Button
          icon="cancel"
          plain
          accessibilityLabel={intl.translate('Polaris.ListFilters.cancel')}
          onClick={this.closeFilters}
        />
      </div>
    );

    const filtersMobileHeaderMarkup = (
      <div className={styles.FiltersContainerHeader}>
        <Button
          icon="cancel"
          plain
          accessibilityLabel={intl.translate('Polaris.ListFilters.cancel')}
          onClick={this.closeFilters}
        />
        <DisplayText size="small">
          {intl.translate('Polaris.ListFilters.moreFilters')}
        </DisplayText>
        <Button onClick={this.closeFilters} primary>
          {intl.translate('Polaris.ListFilters.done')}
        </Button>
      </div>
    );

    const filtersDesktopFooterMarkup = (
      <div className={styles.FiltersContainerFooter}>
        <Button onClick={onResetAll} disabled={!this.hasAppliedFilters}>
          {intl.translate('Polaris.ListFilters.clearAllFilters')}
        </Button>
        <Button onClick={this.closeFilters} primary>
          {intl.translate('Polaris.ListFilters.done')}
        </Button>
      </div>
    );

    const filtersMobileFooterMarkup = (
      <div className={styles.FiltersMobileContainerFooter}>
        {this.hasAppliedFilters ? (
          <Button onClick={onResetAll} fullWidth>
            {intl.translate('Polaris.ListFilters.clearAllFilters')}
          </Button>
        ) : (
          <div className={styles.EmptyFooterState}>
            <TextStyle variation="subdued">
              <p>{intl.translate('Polaris.ListFilters.noFiltersApplied')}</p>
            </TextStyle>
          </div>
        )}
      </div>
    );

    const tagsMarkup =
      appliedFilters && appliedFilters.length ? (
        <div className={styles.TagsContainer}>
          {appliedFilters.map((filter) => {
            return (
              <Tag
                key={filter.key}
                onRemove={() => {
                  filter.onRemove(filter.key);
                }}
              >
                {filter.label}
              </Tag>
            );
          })}
        </div>
      ) : null;

    const filtersContainerMarkup = mobile ? (
      <Sheet open={open} onClose={this.closeFilters}>
        {filtersMobileHeaderMarkup}
        <Scrollable className={styles.FiltersMobileContainerContent} shadow>
          {filtersContentMarkup}
          {filtersMobileFooterMarkup}
        </Scrollable>
      </Sheet>
    ) : (
      <Sheet open={open} onClose={this.closeFilters}>
        <div className={styles.FiltersContainer}>
          {filtersDesktopHeaderMarkup}
          <Scrollable className={styles.FiltersDesktopContainerContent} shadow>
            {filtersContentMarkup}
          </Scrollable>
          {filtersDesktopFooterMarkup}
        </div>
      </Sheet>
    );

    return (
      <div className={styles.ListFilters}>
        {filtersControlMarkup}
        {filtersContainerMarkup}
        {tagsMarkup}
        {backdropMarkup}
        <EventListener event="resize" handler={this.handleResize} />
        <EventListener event="keydown" handler={this.handleKeyDown} />
      </div>
    );
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode !== Key.Escape) {
      return;
    }

    this.closeFilters();
  };

  private getAppliedFilterContent(key: string): string | undefined {
    const {appliedFilters} = this.props;

    if (!appliedFilters) {
      return undefined;
    }

    const filter = appliedFilters.find((filter) => filter.key === key);

    return filter == null ? undefined : filter.label;
  }

  private getAppliedFilterRemoveHandler(key: string): Function | undefined {
    const {appliedFilters} = this.props;

    if (!appliedFilters) {
      return undefined;
    }

    const filter = appliedFilters.find((filter) => filter.key === key);

    return filter == null ? undefined : filter.onRemove;
  }

  private openFilters() {
    this.setState({open: true});
  }

  private closeFilters = () => {
    this.setState({open: false}, () => {
      if (this.moreFiltersButtonContainer.current) {
        focusFirstFocusableNode(this.moreFiltersButtonContainer.current, false);
      }
    });
  };

  private toggleFilters = () => {
    if (this.state.open === true) {
      this.closeFilters();
    } else {
      this.openFilters();
    }
  };

  private openFilter(key: string) {
    this.setState({[`${key}${Suffix.Filter}`]: true});
  }

  private closeFilter(key: string) {
    this.setState({[`${key}${Suffix.Filter}`]: false});
  }

  private toggleFilter(key: string) {
    if (this.state[`${key}${Suffix.Filter}`] === true) {
      this.closeFilter(key);
    } else {
      this.openFilter(key);
    }
  }

  private openFilterShortcut(key: string) {
    this.setState({[`${key}${Suffix.Shortcut}`]: true});
  }

  private closeFilterShortcut(key: string) {
    this.setState({[`${key}${Suffix.Shortcut}`]: false});
  }

  private toggleFilterShortcut(key: string) {
    if (this.state[`${key}${Suffix.Shortcut}`] === true) {
      this.closeFilterShortcut(key);
    } else {
      this.openFilterShortcut(key);
    }
  }

  private transformFilters(
    filters: Filter[] | undefined,
  ): PopoverableAction[] | null {
    const transformedActions: PopoverableAction[] = [];

    if (filters) {
      getShortcutFilters(filters).forEach((filter) => {
        const {key, label} = filter;

        transformedActions.push({
          popoverContent: this.generateFilterMarkup(filter),
          popoverOpen: this.state[`${key}${Suffix.Shortcut}`],
          key,
          content: label,
          onAction: () => this.toggleFilterShortcut(key),
        });
      });
      return transformedActions;
    } else {
      return null;
    }
  }

  private generateFilterMarkup(filter: Filter) {
    const intl = this.props.polaris.intl;
    const removeCallback = this.getAppliedFilterRemoveHandler(filter.key);
    const removeHandler =
      removeCallback == null
        ? undefined
        : () => {
            removeCallback(filter.key);
          };
    return (
      <Stack vertical spacing="tight">
        {filter.filter}
        <Button
          plain
          disabled={removeHandler == null}
          onClick={removeHandler}
          accessibilityLabel={intl.translate('Polaris.ListFilters.clearLabel', {
            filterName: filter.label,
          })}
        >
          {intl.translate('Polaris.ListFilters.clear')}
        </Button>
      </Stack>
    );
  }
}

function isMobile(): boolean {
  return navigationBarCollapsed().matches;
}

function getShortcutFilters(filters: Filter[]) {
  return filters.filter((filter) => filter.shortcut === true);
}

export default withAppProvider<Props>()(ListFilters);
