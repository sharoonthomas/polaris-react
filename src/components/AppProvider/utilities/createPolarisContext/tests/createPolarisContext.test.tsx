import React from 'react';
import StickyManager from '../../StickyManager';
import {ScrollLockManager} from '../../../../../utilities/scroll-lock-manager';
import createPolarisContext from '../createPolarisContext';

jest.mock('../../../../../utilities/intl', () => ({
  Intl: jest.fn(),
  __esModule: true,
}));

jest.mock('../../../../../utilities/unstyled-link', () => ({
  Link: jest.fn(),
  __esModule: true,
}));

describe('createPolarisContext()', () => {
  const Intl: jest.Mock<{}> = require.requireMock(
    '../../../../../utilities/intl',
  ).Intl;
  const Link: jest.Mock<{}> = require.requireMock(
    '../../../../../utilities/unstyled-link',
  ).Link;

  afterEach(() => {
    Intl.mockReset();
    Link.mockReset();
  });

  it('generates default context', () => {
    const context = createPolarisContext();

    expect(context).toMatchObject({
      intl: expect.any(Intl),
      link: expect.any(Link),
      stickyManager: expect.any(StickyManager),
      scrollLockManager: expect.any(ScrollLockManager),
      appBridge: undefined,
      theme: {
        logo: null,
      },
    });
  });

  it('generates context from provided values', () => {
    const i18nContext = {
      Polaris: {
        Common: {
          undo: 'Custom Undo',
        },
      },
    };
    const CustomLinkComponent = () => {
      return <a href="test">Custom Link Component</a>;
    };
    const stickyManager = new StickyManager();
    const scrollLockManager = new ScrollLockManager();
    const appProviderContext = {
      linkComponent: CustomLinkComponent,
      stickyManager,
    };

    const themeContext = {
      logo: {
        topBarSource: 'logo',
      },
    };

    const context = createPolarisContext({
      appProvider: appProviderContext,
      i18n: i18nContext,
      themeProvider: themeContext,
    });

    expect(context).toStrictEqual({
      intl: new Intl(i18nContext),
      link: new Link(CustomLinkComponent),
      stickyManager,
      scrollLockManager,
      appBridge: undefined,
      theme: {
        logo: {
          topBarSource: 'logo',
        },
      },
    });
  });
});
