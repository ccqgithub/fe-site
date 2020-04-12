const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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

module.exports = (envArgs) => {
  let { appEnv, root } = envArgs;
  let comConfJs = path.resolve(root, `./config/com.conf.js`);
  let envConfJs = path.resolve(root, `./config/env/${appEnv}.conf.js`);
  let defConf = getDefConf(envArgs);
  let comConf = require(comConfJs)(envArgs);
  let envConf = {};

  // env config
  if (fs.existsSync(envConfJs)) {
    envConf = require(envConfJs)(envArgs);
  }

  let conf = {};
  // merge conf
  [
    'base',
    'define',
    'output',
    'entry',
    'loader',
    'plugin',
    'public',
    'devServer'
  ].forEach((key) => {
    conf[key] = {
      ...defConf[key],
      ...(comConf[key] || {}),
      ...(envConf[key] || {})
    };
  });

  return conf;
};
