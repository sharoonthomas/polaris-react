import {useContext} from 'react';
/* eslint-disable shopify/strict-component-boundaries */
import {AppProviderContext} from '../../components/AppProvider';
import {ThemeProviderContext} from '../../components/ThemeProvider';
import {PolarisContext} from '../../components/types';
/* eslint-enable shopify/strict-component-boundaries */
import {Omit} from '../../types';

function usePolaris() {
  const polaris = useContext(AppProviderContext);

  if (Object.keys(polaris).length < 1) {
    throw new Error(
      `The <AppProvider> component is required as of v2.0 of Polaris React. See
                  https://polaris.shopify.com/components/structure/app-provider for implementation
                  instructions.`,
    );
  }

  const polarisTheme = useContext(ThemeProviderContext);

  // Intl exists on PolarisContent for legacy reasons.
  // This hook will be removed when we finished moving
  // all our utilities so I feel we don't need a new type.
  const polarisContext: Omit<PolarisContext, 'intl'> = {
    ...polaris,
    theme: polarisTheme,
  };

  return polarisContext;
}

export default usePolaris;
