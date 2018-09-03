# Prettier 代码格式化

> [Prettier](https://prettier.io/): 一个固执己见的代码格式化工具，支持多语言，支持多编辑器，大概有10个左右的配置项。

## 配置

- [.prettierrc.js](../.prettierrc.js)。

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

## 其他相关

- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)。