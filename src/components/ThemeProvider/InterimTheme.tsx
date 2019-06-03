import * as React from 'react';

import {HSLColor} from 'utilities/color-types';
import {
  opacifyColor,
  lightenColor,
  darkenColor,
} from '../../utilities/color-manipulation';
import {
  hslToRgb,
  rgbToHex,
  colorToHsla,
  hslToString,
} from '../../utilities/color-transformers';
import {constructColorName} from '../../utilities/color-names';

import {compose} from '../../utilities/compose';

export interface Props {
  /** The content to display */
  children?: React.ReactNode;
}

export default function InterimTheme(props: Props) {
  return (
    <div style={createStyles()}>{React.Children.only(props.children)}</div>
  );
}

function createStyles(): React.CSSProperties {
  return {
    ...createColorRange('#5C6AC4', 'brand', {opacify: true}),
    ...createColorRange('#007ACE', 'interactive', {opacify: true}),
    ...createColorRange('#47C1BF', 'timely'),
    ...createColorRange('#50B83C', 'positive'),
    ...createColorRange('#EEC200', 'attention'),
    ...createColorRange('#F49342', 'warning'),
    ...createColorRange('#DE3618', 'negative', {opacify: true}),
    ...createColorRange('#9C6ADE', 'accent'),
  };
}

type ColorObject = {
  [key: string]: string;
};

function createColorRange(
  baseColor: string,
  colorRole: string,
  options?: {
    stops?: number;
    increment?: number;
    opacify?: boolean;
    nameSpace?: string;
  },
) {
  const {stops = 2, increment = 15, nameSpace = 'polaris', opacify = false} =
    options || {};

  const hslToHex = compose(
    rgbToHex,
    hslToRgb,
  );

  const hslBaseColor = colorToHsla(baseColor);

  const stopsArray = Array.from({length: stops}, (_, i) => i + 1);

  const base = {
    [constructColorName(nameSpace, colorRole)]: baseColor,
  };

  const lightRange = stopsArray.reduce((colorObject: ColorObject, stop) => {
    colorObject[
      constructColorName(nameSpace, colorRole, `lightened${stop}`)
    ] = hslToHex(lightenColor(hslBaseColor, increment * stop));
    return colorObject;
  }, {});

  const darkRange = stopsArray.reduce((colorObject: ColorObject, stop) => {
    colorObject[
      constructColorName(nameSpace, colorRole, `darkened${stop}`)
    ] = hslToHex(darkenColor(hslBaseColor, increment * stop));
    return colorObject;
  }, {});

  const opaqueRange =
    opacify && createColorOpacityRange(baseColor, colorRole, nameSpace);

  return {
    ...base,
    ...lightRange,
    ...darkRange,
    ...opaqueRange,
  };
}

function createColorOpacityRange(
  baseColor: string,
  colorRole: string,
  nameSpace: string,
): ColorObject {
  const {hue, saturation, lightness} = colorToHsla(baseColor) as HSLColor;

  return [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].reduce(
    (colorObject: ColorObject, stop) => {
      colorObject[
        constructColorName(
          nameSpace,
          colorRole,
          `opacified${stop.toString().split('0.')[1]}`,
        )
      ] = hslToString(
        opacifyColor({hue, saturation, lightness, alpha: 1}, stop),
      );

      return colorObject;
    },
    {},
  );
}
