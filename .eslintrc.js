module.exports = {
  "parserOptions": {
    // move it into parserOptions, for eslint-plugin-vue
    // https://github.com/vuejs/eslint-plugin-vue#couple-faq
    "parser": "babel-eslint",
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    // https://github.com/benmosher/eslint-plugin-import#settings
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".vue"
        ]
      }
    }
  },
  "plugins": [
    "babel",
    "prettier"
  ],
  "extends": [
    "plugin:vue/recommended",
    "airbnb",
    "prettier",
    "prettier/react",
    "prettier/standard"
  ],
  "env": {
    "browser": true,
    "es6": true,
  },
  "rules": {
    "prettier/prettier": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "off",
    "prefer-destructuring": "off",
    "import/no-extraneous-dependencies": "off",
    "eqeqeq": "off",
    "no-console": "off",
    "global-require": "off",
    "consistent-return": "off"
  },
  "overrides": [
    {
      "files": ["build/**/*", "config/**/*", "script/**/*"],
      "parserOptions": {
        // move it into parserOptions, for eslint-plugin-vue
        // https://github.com/vuejs/eslint-plugin-vue#couple-faq
        "parser": "espree",
        "ecmaVersion": 2018,
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true
        }
      },
      "env": {
        "browser": false,
        "node": true
      }
    }
  ]
}