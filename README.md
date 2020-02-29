# fe-site

> 前端网站脚手架：目前开发中的版本可能无法正常运行，如果遇到请使用tags(releases)中的稳定版本

## 支持

- 配置：统一明确的配置文件（支持开发和生产模式，多部署环境）。
- 构建：webpack4 (多html，分包，dev server，热加载)。
- 样式：less、sass、stylus、postcss。
- vue项目：vue + vue-router + vuex。
- ract项目：react + react-router + mobx + mobx-react。
- 国际化：i18n + [i18n-service](https://github.com/ccqgithub/i18n-service)。
- docker: 有 docker + nginx 配置示例。
- nginx: 有 nginx 配置示例。
- 文档： 支持 jsdoc。

## 使用前必读1：依赖环境

- node@8.x (support: async, await, es class等……)

## 使用前必读2：环境变量

默认必须配置两个环境变量

- `process.env.NODE_ENV`: 主要配置 `本地开发调试` 和 `发布` 的区别，development, production.
- `process.env.APP_ENV`: 配置不同发布环境：dev, test, prod 等...

## vue 项目推荐：

- [vue](https://github.com/vuejs/vue)。
- [vue-router](https://github.com/vuejs/vue-router)。
- [vuex](https://github.com/vuejs/vuex)。
- [rxjs](https://github.com/ReactiveX/rxjs)。

## react 项目推荐：

- [react](https://github.com/facebook/react/)。
- [react-router](https://github.com/ReactTraining/react-router)。
- [mobx](https://github.com/mobxjs/mobx)。
- [mobx-react](https://github.com/mobxjs/mobx-react)。
- [rxjs](https://github.com/ReactiveX/rxjs)。

## 开始开发：

- `git clone https://github.com/ccqgithub/fe-site.git`
- `npm install`
- `npm run dev` 
- 浏览器打开 [React App: http://127.0.0.1:3003/react/](http://127.0.0.1:3003/react/)
- 浏览器打开 [Vue App: http://127.0.0.1:3003/vue/](http://127.0.0.1:3003/vue/)

## 配置

所以配置文件放在`config`目录下：

- `project.conf.js`: 项目的常规配置，不分环境。
- `define.conf.js`: 配置项目中的常量[DefinePlugin](https://webpack.js.org/plugins/define-plugin/), 其中`REPLAC_`开头的为特殊常量，用于替换html文件中的字符串。
- `public.conf.js`: 构建输出配置。

分环境配置：

- `define.conf.js` 和 `public.conf.js` 中可以分环境配置。

## 目录

```txt
---- root: 不需要编译，直接输出到根目录的文件
---- src: 源码
  |---- asset: 静态资源
  |---- data: 数据
     |---- apis: api基础文件，用来调用api
     |---- soureces: 数据源
     |---- vue-stores: vuex 的数据 store
     |---- rc-stores: mobx 数据store
     |---- flows: 数据流
     |---- i18n: 国际化翻译数据
     |
  |---- entry: 入口js
  |---- html: html文件
  |---- 其他
  |
---- build: 构建脚步
  |
---- config: 配置文件
  |---- project.conf.js: 项目的常规配置，不分环境
  |---- define.conf.js:  配置项目中的常量
  |---- public.conf.js: 构建输出配置
  |
---- nginx: nginx 配置示例
---- docker: docker 配置示例
---- docs: 存放文档
---- script: 存放项目需要的相关脚本文件
  |---- i18n-download.js 从`i18n-service`下载翻译文件
  |

```

## 代码风格

- [Prettier 代码格式化](./doc/code-style/prettier.md)。
- [Eslint 配置、使用](./doc/code-style/eslint.md)。
- [Tslint 配置、使用](./doc/code-style/tslint.md)。
- [Stylelint 配置、使用](./doc/code-style/stylelint.md)。
- [Htmllint 配置、使用](./doc/code-style/htmllint.md)。

## Todo

- 完善eslint
- 完善stylelint
- tslint
- htmllint
- 精简目录
- 接入Jest