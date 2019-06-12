interface CSSCustomProperties {
  [key: string]: string;
}

interface ComponentThemeProperties {
  [key: string]: CSSCustomProperties;
}

const baseComponentTheme: ComponentThemeProperties = {
  default: {
    text: '--polaris-surface-28',
    icon: '--polaris-surface-27',
    backgroundPrimary: '--polaris-surface-0',
    backgroundSecondary: '--polaris-surface-1',
    border: '--polaris-surface-8',
  },
  hover: {
    backgroundPrimary: '--polaris-surface-1',
    backgroundSecondary: '--polaris-surface-2',
    border: '--polaris-surface-8',
  },
  focus: {
    border: '--polaris-brand',
    shadow: '--polaris-brand',
  },
  active: {
    backgroundPrimary: '--polaris-surface-1',
    backgroundSecondary: '--polaris-surface-1',
    border: '--polaris-surface-4',
    shadowPrimary: '--polaris-surface-opposingOpacified2',
    shadowSecondary: '--polaris-surface-opposingOpacified3',
  },
  disabled: {
    text: '--polaris-surface-20',
    icon: '--polaris-surface-20',
    backgroundPrimary: '--polaris-surface-1',
    backgroundSecondary: '--polaris-surface-1',
  },
};

const primaryComponentTheme: ComponentThemeProperties = {
  default: {
    text: '--polaris-surface-0',
    icon: '--polaris-surface-27',
    backgroundPrimary: '--polaris-brand-lightened1',
    backgroundSecondary: '--polaris-brand-darkened1',
    border: '--polaris-brand-darkened2',
    shadow: '--polaris-brand-lightened1',
  },
  // TODO : below
  hover: {
    backgroundPrimary: '--polaris-surface-1',
    backgroundSecondary: '--polaris-surface-2',
    border: '--polaris-surface-8',
    // text
  },
  focus: {
    border: '--polaris-brand',
    shadow: '--polaris-brand',
  },
  active: {
    backgroundPrimary: '--polaris-surface-1',
    backgroundSecondary: '--polaris-surface-1',
    border: '--polaris-surface-4',
    shadowPrimary: '--polaris-surface-opposingOpacified2',
    shadowSecondary: '--polaris-surface-opposingOpacified3',
  },
  disabled: {
    text: '--polaris-surface-20',
    icon: '--polaris-surface-20',
    backgroundPrimary: '--polaris-surface-1',
    backgroundSecondary: '--polaris-surface-1',
    // border
  },
};

function reduceTheme(theme: ComponentThemeProperties): CSSCustomProperties {
  return Object.entries(theme)
    .reduce((childAccumulator, childCurrent) => {
      return [
        ...childAccumulator,
        ...Object.entries(childCurrent[1]).reduce(
          (propertyAccumulator, propertyCurrent) => {
            return [
              ...propertyAccumulator,
              ...[
                {
                  [`--${childCurrent[0]}-${propertyCurrent[0]}`]: `var(${
                    propertyCurrent[1]
                  })`,
                },
              ],
            ];
          },
          [],
        ),
      ];
    }, [])
    .reduce((accumulator, current) => {
      return {...accumulator, ...current};
    }, {});
}

const theme = {
  base: reduceTheme(baseComponentTheme),
  primary: reduceTheme(primaryComponentTheme),
};

export default theme;
