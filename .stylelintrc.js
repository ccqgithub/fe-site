module.exports = {
  processors: [
    [
      '@mapbox/stylelint-processor-arbitrary-tags',
      {
        fileFilterRegex: [/\.vue$/],
        endTag: '</\\s*?style>',
      },
    ],
  ],
  plugins: ['stylelint-prettier'],
  extends: ['stylelint-config-recommended', 'stylelint-prettier/recommended'],
  rules: {
    'prettier/prettier': [
      true,
      {
        semi: true,
      },
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page', 'cover-view', 'swiper', 'swiper-item'],
      },
    ],
    'no-empty-source': null,
    'color-hex-case': null,
  },
  defaultSeverity: 'warning',
};
