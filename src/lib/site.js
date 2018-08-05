const { language, languageType } = window;

export function getBaseUrl() {
  return languageType == 'path' ? `/${language}/` : '/';
}

export function getBaseUrlWithLocale() {
  return `/${language}/`;
}