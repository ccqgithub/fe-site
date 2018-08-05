import I18n from 'i18n-s';

const localeDatas = {
  'zh-CN': require('../data/i18n/zh-CN.json'),
  'en-US': require('../data/i18n/en-US.json')
};
const language = window.language;

const i18n = new I18n();
i18n.setLocale(language);
i18n.setLocaleData(language, localeDatas[language]);

export const __ = i18n.__.bind(i18n);
