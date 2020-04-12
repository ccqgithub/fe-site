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
- `npm run build-uat`: 构建uat环境。
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

- `node ./script/cli.js build -a dev -n development -r ./ -s`: 执行构建。

其中:

- `-n` or `-node-env`: 构建环境，`development | production`, 默认`production`。
- `-a` or `-app-env`: 发布环境类别，比如`uat`,`prod`等，默认`prod`。
- `-r` or `-root`: 项目根目录，默认执行命令的目录`process.cwd()`，在根目录之外的地方执行构建才需要这个选项。
- `-s` or `-server`: 是否启动`webpack-dev-server`，默认`false`。

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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// 国际化配置
const i18nConfig = {
  // 开启国际化
  on: true,
  // 语言列表
  languages: ['zh-CN', 'en-US'],
  // 映射语言
  map: {
    zh: 'zh-CN',
    en: 'en-US'
  },
  // 检查语言的顺序
  detects: [
    // /zh-CN/xxx
    'path',
    // /xxx?lang=zh-CN
    'query',
    // localStorage.getItem('lang')
    'store',
    // navigator.language: zh-CN
    'browser'
  ],
  // 默认语言
  default: 'zh-CN'
};

module.exports = (envArgs) => {
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
      // splitChunks: null,
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 900000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 4,
        automaticNameDelimiter: '-',
        name: !isProduction,
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|prop-types)[\\/]/,
            priority: 2,
            name: 'vendor-rect',
            reuseExistingChunk: true
          },
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            priority: 2,
            name: 'vendor-vue',
            reuseExistingChunk: true
          },
          rxjs: {
            test: /[\\/]node_modules[\\/](rxjs)[\\/]/,
            priority: 2,
            name: 'vendor-rxjs',
            reuseExistingChunk: true
          }
        }
      }
    },

    // entry
    entry: {
      // js entry
      js: {
        'entry/index': './entry/index.js',
        'entry/vue-app': './entry/vue-app.js',
        'entry/rc-app': './entry/rc-app.jsx'
      },
      // html
      html: [
        {
          template: 'html/index.html',
          filename: 'index.html',
          chunks: ['entry/index'],
          inject: false,
          minify: false,
          data: {
            publicPath: '/',
            i18nConfig
          }
        },
        {
          template: 'html/vue-app.html',
          filename: 'vue-app.html',
          chunks: ['entry/vue-app'],
          inject: false,
          minify: false,
          data: {
            publicPath: '/',
            i18nConfig
          }
        },
        {
          template: 'html/rc-app.html',
          filename: 'rc-app.html',
          chunks: ['entry/rc-app'],
          inject: false,
          minify: false,
          data: {
            publicPath: '/',
            i18nConfig
          }
        }
      ]
    },

    // loaders
    loader: {
      rules: [
        {
          test: /html\/.*\.html$/,
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
                attributes: {
                  list: [
                    {
                      tag: 'img',
                      attribute: 'src',
                      type: 'src'
                    }
                  ]
                },
                minimize: {
                  removeComments: false,
                  collapseWhitespace: false,
                  removeAttributeQuotes: false
                }
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
          use: (envArgs.nodeEnv === 'production'
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
          use: (envArgs.nodeEnv === 'production'
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
          use: (envArgs.nodeEnv === 'production'
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
          use: (envArgs.nodeEnv === 'production'
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
          use: (envArgs.nodeEnv === 'production'
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

    i18n: i18nConfig,

    // dev server
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      port: 3003,
      contentBase: path.join(envArgs.root, './dist'),
      writeToDisk: true,
      headers: {
        'Access-Control-Expose-Headers': 'Token',
        'Access-Control-Allow-Headers': 'Token,Locale,Content-Type',
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        '/xxx-api': 'http://localhost:3000'
      }
    }
  };
};
```
