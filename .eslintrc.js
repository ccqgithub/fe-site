module.exports = {
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
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
    "prettier"
  ],
  "extends": [
    "plugin:vue/essential",
    "airbnb",
    "prettier",
    "prettier/react",
    "prettier/standard"
  ],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
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
  }
}