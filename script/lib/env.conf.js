const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
      mode: envArgs.nodeEnv === 'production' ? 'production' : 'development'
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

module.exports = (envArgs) => {
  let { appEnv, nodeEnv, root } = envArgs;
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
      ...defConf,
      ...(comConf[key] || {}),
      ...(envConf[key] || {})
    };
  });

  return conf;
};
