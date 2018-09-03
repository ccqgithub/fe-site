# Eslint 配置、使用

> 使用工具来帮助写出更规范、少出错的代码，包括编辑器配置、代码扫描、代码格式化。

## 配置

- [.eslintrc.js](../.eslintrc.js)。

## 编辑器`eslint 配置`，扫描js文件。

1. 安装插件[Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)。

2. 在项目根目录建立Eslint配置文件`.eslintrc.js`，填写配置，例子见[.eslintrc.js](../.eslintrc.js)。

3. 在项目安装需要的npm包

    ```sh
    npm i -D eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-vue eslint-plugin-babel prettier babel-eslint 
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

    ![vscode-eslint-fix]](./image/vscode-eslint-fix.jpeg).

## 打包时代码审查

> todo: webpack 配置 eslint-loader