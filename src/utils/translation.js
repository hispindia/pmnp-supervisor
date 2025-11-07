import { isEmpty } from "lodash";

export const getTranslationDisplayName = (de, locale) => {
  // If no translations available, return the displayFormName or displayName
  if (isEmpty(de.translations)) {
    return de.displayFormName || de.displayName;
  }

  // Look for translation matching the locale
  const translation = de.translations.find((t) => t.locale === locale);

  // If translation found, return its value
  if (translation && translation.value) {
    return translation.value;
  }

  // Fallback to original displayFormName or displayName
  return de.displayFormName || de.displayName;
};
