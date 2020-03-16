# fe-site

> 前端网站脚手架：目前开发中的版本可能无法正常运行，如果遇到请使用tags(releases)中的稳定版本

## 开箱支持以下特性

- [React](https://github.com/facebook/react)
- [Vue](https://github.com/vuejs/vue)
- [Babel](https://babeljs.io/)
- [Webpack](https://webpack.js.org/)
- [热重载](https://webpack.docschina.org/guides/hot-module-replacement/#src/components/Sidebar/Sidebar.jsx)
- [Eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [Browserslist](https://github.com/browserslist/browserslist)
- Dev Server
- 多html入口
- 分环境构建

## 初始化

```sh
npx fe-site your-project
cd your-project
```

## 开发

> 具体见 `package.json` 中的 `scripts` 选项、

- `npm run dev`: 会启动一个本地的`dev server`, 并且实时构建。
- `npm run dev-server`: 只启动本地server，但是不进行构建，主要用来预览测试build的结果。
- `npm run build-prod`: 构建prod环境。

## 目录结构

```sh
-------------
  |----config: 构建配置
  |----doc: 文档相关
  |----public: 构建过程中直接拷贝而不编译的文件，里面的文件默认会直接输出到构建后的根目录。
  |----script: cli脚本
  |----src: 编译源码，webpack打包的context
```

## 构建中遇到的概念

- `process.env.NODE_ENV` or `nodeEnv`: 构建的环境，很多构建工具会使用此变量，比如开发为`development`，测试为`test`，发布生产为`production`。
- `process.env.APP_ENV` or `appEnv`: 表示项目发布的目的，因为项目可能会发布多个生产环境(NODE_ENV都为`production`)，但是又有些差别，比如调用的API不同，最常见的场景是预发布`uat`和正式发布`prod`的区别。
- `root`: 项目根目录。
- `context`: webpack构建上下文。

## cli

为了方便开发，内置了一个简单的cli工具：`node ./script/cli.js`, 命令如下：

- `node ./script/cli.js dev --app-env=dev --node-env=development -root ./`: 监听、执行构建并启动dev server。
- `node ./script/cli.js build --app-env=uat --node-env=production -root ./`: 打包生产环境。
- `node ./script/cli.js dev-server --app-env=dev --node-env=development -root ./`: 只启动dev server不监听webpack，目的是用来预览测试build之后的内容。

其中 `--app-dev`别名`-a`，`--node-env`别名`-n`，`-root`别名`-r`，上面列出来的为各命令的默认值。

`root`为相对于当前执行命令的目录，如果执行命令不是在项目根目录，则不能省略。

## 检查兼容性

```sh
npx browserslist
```

## 配置

- `config/env/${env}.conf.js`

构建配置都放在`config`目录下，配置方式：

```js
// envArgs = { appEnv, nodeEnv, root }
module.exports = (envArgs) => {
  return {
    // define constants
    define: {
      API_BASEURL: JSON.stringify(`https://api.${envArgs.appEnv}.dev.com/`)
    }
  };
};

```

合并优先级：`config/env/${env}.conf.js` > `config/com.conf.js` > 默认配置。

配置合并策略：一级属性进行合并，二级属性进行替换，比如

`config/env/${env}.conf.js`

```js
{
  base: {},
  define: { a: 1 }
}
```

`config/com.conf.js`

```js
{
  base: { context: './' },
  define: { b: 2 }
}
```

合并后

```js
{
  base: { context: './' },
  define: { a: 1 }
}
```

默认配置：

```js
const getDefConf = (envArgs) => {
  const isProduction = envArgs.nodeEnv === 'production';

  return {
    // base
    base: {
      context: path.resolve(envArgs.root, './src/')
    },

    // define constants
    define: {
      PUBLIC_PATH: JSON.stringify('/'),
      GLOBAL_DATA: JSON.stringify({ appEnv: envArgs.appEnv }),
      API_BASEURL: JSON.stringify(`https://api.${envArgs.appEnv}.com/`),
      'process.env.NODE_ENV': JSON.stringify(envArgs.nodeEnv),
      'process.env.APP_ENV': JSON.stringify(envArgs.appEnv)
    },

    // output settings
    output: {
      // 输出目录
      distPath: path.join(envArgs.root, './dist'),
      // public path
      publicPath: '/',
      // 是否输出source map
      sourceMap: envArgs.nodeEnv !== 'production',
      // 是否压缩
      compress: envArgs.nodeEnv === 'production',
      // 是否清理产出目录distPath
      clear: envArgs.nodeEnv !== 'production',
      // mode
      mode: envArgs.nodeEnv === 'production' ? 'production' : 'development',
      // 是否保存stats.json，以供后续分析
      statsJson: true,
      // split chunks
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 900000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '-',
        name: !isProduction
      }
    },

    // entry
    entry: {
      // js entry
      js: {
        'entry/index': './entry/index.js'
      },
      // html
      html: [
        {
          template: 'html/index.html',
          filename: 'index.html',
          chunks: ['entry/index'],
          inject: false,
          minify: false,
          others: {
            publicPath: '/'
          }
        }
      ]
    },

    // loaders
    loader: {
      rules: [
        {
          test: /partial\/.*\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src'],
                minimize: false,
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: false,
                interpolate: 'require'
              }
            }
          ]
        },
        {
          test: /html\/[^/]*\.html$/,
          use: [
            {
              loader: 'ejs-loader'
            },
            {
              loader: 'extract-loader'
            },
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src'],
                minimize: true,
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: false,
                interpolate: 'require'
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.less$/,
          use: (isProduction
            ? [MiniCssExtractPlugin.loader]
            : [
                {
                  loader: 'style-loader'
                }
              ]
          ).concat([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 0,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [require('autoprefixer')()],
                sourceMap: !isProduction
              }
            },
            {
              loader: 'less-loader',
              options: {
                paths: [path.join(envArgs.root, 'node_modules')],
                relativeUrls: true,
                math: 'parens-division',
                strictUnits: true,
                sourceMap: !isProduction
              }
            }
          ])
        },
        {
          test: /\.scss$/,
          use: (isProduction
            ? [MiniCssExtractPlugin.loader]
            : [
                {
                  loader: 'style-loader'
                }
              ]
          ).concat([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 0,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [require('autoprefixer')()],
                sourceMap: !isProduction
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction
              }
            }
          ])
        },
        {
          test: /\.styl$/,
          use: (isProduction
            ? [MiniCssExtractPlugin.loader]
            : [
                {
                  loader: 'style-loader'
                }
              ]
          ).concat([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 0,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [require('autoprefixer')()],
                sourceMap: !isProduction
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: !isProduction
              }
            }
          ])
        },
        {
          test: /\.pcss$/,
          use: (isProduction
            ? [MiniCssExtractPlugin.loader]
            : [
                {
                  loader: 'style-loader'
                }
              ]
          ).concat([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 0,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [require('autoprefixer')()],
                sourceMap: !isProduction
              }
            }
          ])
        },
        {
          test: /\.css$/,
          use: (isProduction
            ? [MiniCssExtractPlugin.loader]
            : [
                {
                  loader: 'style-loader'
                }
              ]
          ).concat([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 0,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [require('autoprefixer')()],
                sourceMap: !isProduction
              }
            }
          ])
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: path.resolve(envArgs.root, './.cache'),
                configFile: false
              }
            }
          ]
        },
        {
          test: /\.jsx$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: path.resolve(envArgs.root, './.cache'),
                configFile: false
              }
            }
          ]
        },
        {
          test: /\.(ico|png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'imgs/[path][name].[hash].[ext]'
          }
        },
        {
          test: /\.(mp3|mp4)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            name: 'medias/[path][name].[hash].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[path][name].[hash].[ext]'
          }
        }
      ]
    },

    plugin: {
      vue: true
    },

    public: {
      copyList: [
        {
          from: path.resolve(envArgs.root, './public'),
          to: path.resolve(envArgs.root, './dist'),
          ignore: ['.*']
        }
      ]
    },

    // dev server
    devServer: {
      // 端口
      port: 3003,
      // 跨域
      // https://github.com/koajs/cors
      proxyCors: {
        allowHeaders: ['TOKEN', 'Locale', 'content-type'],
        exposeHeaders: ['TOKEN']
      },
      // https://github.com/popomore/koa-proxy
      proxies: [
        {
          host: 'http://www.xxx.cn',
          match: /^\/xxx\//
        }
      ],
      // url 重写
      // https://github.com/koajs/rewrite
      rewrites: [
        [/^\/vue(\/.*|$)/, '/vue-app.html'],
        [/^\/react(\/.*|$)/, '/rc-app.html']
      ]
    }
  };
};
```
