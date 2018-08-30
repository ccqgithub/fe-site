module.exports = {
  "processors": [
    ["@mapbox/stylelint-processor-arbitrary-tags", {
      fileFilterRegex: [/\.vue$/],
      endTag: '</\\s*?style>'
    }]
  ],
  plugins: ['stylelint-prettier'],
  extends: [
    'stylelint-config-recommended', 
    'stylelint-prettier/recommended'
  ],
  rules: {
    'prettier/prettier': [true, {
      semi: true
    }],
    'no-empty-source': null
  },
  defaultSeverity: 'warning',
};