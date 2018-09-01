# fe-site

> 前端网站脚手架

## 支持

- 配置：统一明确的配置文件（支持开发和生产模式，多部署环境）。
- 构建：webpack4 (多html，分包，dev server，热加载)。
- 样式：less、sass、stylus、postcss。
- vue项目：vue + vue-router + vuex + rxjs + gentx (推荐配置)。
- ract项目：react + react-router + mobx + mobx-react + rxjs + gentx (推荐配置)。
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

## 使用前必读3：推荐数据管理模式

应用中数据管理的所有部分分为三个部分：

- 数据存储：自定义数据Store，LocalStore，SessionStore，Cookie等…
- 数据流动变换：将一定事件循环内的所有数据变换抽象为数据的流动，比如点击添加用户按钮的过程，会产生这样一个数据流： 点击按钮 => 参数封装器 => 接口请求器 => 结果处理器 => 数据Store => UI。
- 数据反应：数据改变是产生一些副作用，比如修改数据自动更新UI。

vue项目推荐数据管理模式：

- vuex 用来作为store 和 数据反应。
- rxjs + gentx 用来管理数据流。

react 项目推荐书籍管理模式：

- mobx + mobx-react 用来作为store 和 数据反应。
- rxjs + gentx 用来管理数据流。

灵活处理：

- 这只是大项目推荐的数据管理模式，如果你项目较小，只需要store和数据反应，不需要数据流管理，那可以放弃用`rxjs + gentx`，只用mobx或者vuex。

## vue 项目推荐：

- [vue](https://github.com/vuejs/vue)。
- [vue-router](https://github.com/vuejs/vue-router)。
- [vuex](https://github.com/vuejs/vuex)。
- [rxjs](https://github.com/ReactiveX/rxjs)。
- [gentx](https://github.com/ccqgithub/gentx)。

## react 项目推荐：

- [react](https://github.com/facebook/react/)。
- [react-router](https://github.com/ReactTraining/react-router)。
- [mobx](https://github.com/mobxjs/mobx)。
- [mobx-react](https://github.com/mobxjs/mobx-react)。
- [rxjs](https://github.com/ReactiveX/rxjs)。
- [gentx](https://github.com/ccqgithub/gentx)。

## 开始开发：

- `git clone https://github.com/ccqgithub/fe-site.git`
- `npm install`
- `npm run dev` 
- 浏览器打开 [React App: http://127.0.0.1:3003/react/](http://127.0.0.1:3003/react/)
- 浏览器打开 [React Router H5: http://127.0.0.1:3003/rc-router-h5.html](http://127.0.0.1:3003/rc-router-h5.html)
- 浏览器打开 [React Router Admin: http://127.0.0.1:3003/rc-router-admin.html](http://127.0.0.1:3003/rc-router-admin.html)
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

- [Prettier 代码格式化](./docs/code-style/prettier.md)。
- [Eslint 配置、使用](./docs/code-style/eslint.md)。
- [Tslint 配置、使用](./docs/code-style/tslint.md)。
- [Stylelint 配置、使用](./docs/code-style/stylelint.md)。
- [Htmllint 配置、使用](./docs/code-style/htmllint.md)。

## Todo

- 完善eslint
- 完善stylelint
- tslint
- htmllint
- 精简目录
- 接入Jest