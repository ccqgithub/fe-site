module.exports = {
  parserOptions: {
    // move it into parserOptions, for eslint-plugin-vue
    // https://github.com/vuejs/eslint-plugin-vue#couple-faq
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    // https://github.com/benmosher/eslint-plugin-import#settings
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  plugins: [
    // https://github.com/babel/eslint-plugin-babel
    'babel',
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier',
  ],
  extends: [
    'plugin:vue/recommended',

    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
    'airbnb-base',
    // https://github.com/yannickcr/eslint-plugin-react
    'airbnb/rules/react',
    // https://github.com/evcohen/eslint-plugin-jsx-a11y#readme
    // https://developer.mozilla.org/zh-CN/docs/Glossary/Accessibility
    // 无障碍网页（Web Accessibility ，缩写：A11Y）
    // "airbnb/rules/react-a11y",

    // https://github.com/prettier/eslint-plugin-prettier
    'prettier',
    'prettier/react',
    'prettier/standard',
  ],
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    // prettier 格式化
    'prettier/prettier': 'warn',
    // 未使用变量
    'no-unused-vars': 'warn',
    // 不能使用console
    'no-console': 'warn',
    // 禁止使用 javascript: url
    'no-script-url': 'warn',
    // 未改变的变量，强制使用const
    'prefer-const': 'off',
    // 只能使用解构获取对象的值
    'prefer-destructuring': 'off',
    // 不能导入dependencies之外的模块，比如devDependencies
    'import/no-extraneous-dependencies': 'off',
    // 强制使用全等
    eqeqeq: 'warn',
    // 不允许全局require
    'global-require': 'off',
    // 要求 return 语句要么总是指定返回的值，要么不指定
    'consistent-return': 'off',
    // 不能把children作为属性传入
    'react/no-children-prop': 'off',
    // 无状态组件用函数
    'react/prefer-stateless-function': 'warn',
    // 一个文件只能有一个组件
    'react/no-multi-comp': 'off',
    // 必须制定 prop-types
    'react/prop-types': 'off',
    // 只能使用解构获取对象的值
    'react/destructuring-assignment': 'off',
    // 转义html实体字符
    'react/no-unescaped-entities': 'off',
  },
  overrides: [
    // build相关运行在node环境
    {
      files: ['build/**/*', 'config/**/*', 'script/**/*'],
      parserOptions: {
        // move it into parserOptions, for eslint-plugin-vue
        // https://github.com/vuejs/eslint-plugin-vue#couple-faq
        parser: 'espree',
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
