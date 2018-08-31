# Javascript 规范、优化、代码指南

> 使用工具来帮助写出更规范、少出错的代码，包括编辑器配置、代码扫描、代码格式化。

## 相关工具

- [Visual Studio Code](https://code.visualstudio.com/): 当下最流行的前端代码编辑器，界面美观，功能强大，插件丰富，有强大的团队维护，更新频繁。
- [Prettier](https://prettier.io/): 一个固执己见的代码格式化工具，支持多语言，支持多编辑器，大概有10个左右的配置项。
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)：最受社区欢迎的JavaScript代码风格指南。
- [ESLint](https://eslint.org/)：ESLint 是一个开源的JavaScript代码扫描工具，可帮助您发现并纠正代码结构质量的问题。

## 编辑器`格式化`配置

1. 安装 vscode 插件[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)。

2. 在项目根目录建立`Prettier`配置文件`.prettierrc.js`, 设置格式化选项，例子见[.prettierrc.js](../.prettierrc.js);

3. 移除其他的代码格式化插件（比如beautify等），因为可能导致冲突。如果开发vue，吧`vetur`插件配置里的格式化工具都改成`prettier`。

4. 配置你的格式化快捷键: `editor.action.formatDocument` 和 `editor.action.formatSelection`。

5. 格式化：

    - 开发的时候可以开启`保存时格式化代码`(适合新项目，并且所有人都配置了相同的格式化)。
    - 最好是开发时只格式化选中的那部分(editor.action.formatSelection)。
    - 还有种方法就是使用eslint的修复功能（后面会介绍）。
    - 目前格式化选中的代码在某些文件里无效，期待插件将来完善，[支持](https://github.com/prettier/prettier-vscode/blob/v1.6.1/src/utils.ts#L42-L51)。

## 编辑器`eslint 配置`，扫描js文件。

1. 安装插件[Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)。

2. 在项目根目录建立Eslint配置文件`.eslintrc.js`，填写配置，例子见[.eslintrc.js](../.eslintrc.js)。

3. 在项目安装需要的npm包

    ```sh
    npm i -D eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-vue prettier 
    ```
4. 打开编辑器的配置，配置eslint验证语言，让他支持vue文件。

    ```json
    "eslint.validate": [
      "javascript",
      "javascriptreact",
      {
        "language": "vue",
        "autoFix": true
      }
    ]
    ```
5. 编写代码时，会提示错误信息，点击小灯泡修复(可能不同主题不同)。

    ![]](./images/vscode-eslint-fix.jpeg).

## 打包时代码审查

> todo: webpack 配置 eslint-loader