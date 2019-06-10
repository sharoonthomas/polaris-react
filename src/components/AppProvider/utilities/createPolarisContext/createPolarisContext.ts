import {PolarisContext} from '../../../types';
import {
  createThemeContext,
  ThemeProviderContextType as CreateThemeContext,
} from '../../../ThemeProvider';
import {AppProviderProps} from '../../types';
import StickyManager from '../StickyManager';
import createAppProviderContext, {
  CreateAppProviderContext,
} from '../createAppProviderContext';
import Intl, {TranslationDictionary} from '../../../../utilities/intl';

export interface CreatePolarisContext extends AppProviderProps {
  stickyManager?: StickyManager;
}

interface Context {
  appProvider?: CreateAppProviderContext;
  themeProvider?: CreateThemeContext;
  i18n?: TranslationDictionary | TranslationDictionary[];
}

export default function createPolarisContext(
  context: Context = {},
): PolarisContext {
  const {
    appProvider: appProviderContext,
    themeProvider: themeProviderContext,
    i18n: translations = {},
  } = context;

  const appProvider = appProviderContext
    ? createAppProviderContext(appProviderContext)
    : createAppProviderContext();
  const theme = themeProviderContext
    ? createThemeContext(themeProviderContext)
    : createThemeContext();
  const intl = new Intl(translations);

  return {...appProvider, intl, theme};
}
