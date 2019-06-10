import {get} from '../get';
import merge from '../merge';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface PrimitiveReplacementDictionary {
  [key: string]: string | number;
}

export interface ComplexReplacementDictionary {
  [key: string]: string | number | React.ReactNode;
}

export interface ChangeTranslation {
  (translation: TranslationDictionary): void;
}

const REPLACE_REGEX = /{([^}]*)}/g;

export default class Intl {
  constructor(
    private translation:
      | TranslationDictionary
      | TranslationDictionary[]
      | undefined,
  ) {
    this.setTranslation(translation);
  }

  setTranslation(
    translation: TranslationDictionary | TranslationDictionary[] | undefined,
  ) {
    this.translation = Array.isArray(translation)
      ? merge(...translation)
      : translation;
  }

  translate = (
    id: string,
    replacements?:
      | PrimitiveReplacementDictionary
      | ComplexReplacementDictionary,
  ): string => {
    return translate(id, this.translation, replacements);
  };

  translationKeyExists(path: string): boolean {
    return Boolean(get(this.translation, path));
  }
}

export function translate(
  id: string,
  translations: TranslationDictionary | TranslationDictionary[] | undefined,
  replacements?: PrimitiveReplacementDictionary | ComplexReplacementDictionary,
) {
  const text = get(translations, id) as string;

  if (!text) {
    return '';
  }

  if (replacements) {
    return text.replace(REPLACE_REGEX, (match: string) => {
      const replacement: string = match.substring(1, match.length - 1);

      if (!replacements.hasOwnProperty(replacement)) {
        throw new Error(
          `No replacement found for key '${replacement}'. The following replacements were passed: ${Object.keys(
            replacements,
          )
            .map((key) => `'${key}'`)
            .join(', ')}`,
        );
      }

      return replacements[replacement] as string;
    });
  }

  return text;
}
