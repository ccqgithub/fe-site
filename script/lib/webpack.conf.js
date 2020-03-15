const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (envArgs) => {
  const envConf = require('./env.conf')(envArgs);
  const isProduction = envArgs.nodeEnv === 'production';

  // entry js
  const hotReloadEntry = [
    `webpack-hot-middleware/client?reload=false&path=${envConf.output.publicPath}__webpack_hmr`
  ];
  const entryObj = {};
  Object.keys(envConf.entry.js).forEach((key) => {
    if (isProduction) {
      entryObj[key] = envConf.entry.js[key];
    } else {
      entryObj[key] = [].concat(envConf.entry.js[key]).concat(hotReloadEntry);
    }
  });

  const webpackConfig = {
    context: envConf.base.context,
    devtool: 'source-map',
    mode: isProduction ? 'production' : 'development',
    entry: entryObj,
    output: {
      path: envConf.output.distPath,
      filename: 'js/[name].[hash].js',
      publicPath: envConf.output.publicPath
    },
    resolve: {
      modules: ['node_modules', path.resolve(envArgs.root, '../node_modules')],
      extensions: ['.js', '.jsx', '.vue', '.json', '.less', '.scss'],
      alias: {
        //
      }
    },
    module: {
      rules: envConf.loader.rules
    }
  };

  // optimization
  const reVendorReact = /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|prop-types)[\\/]/;
  const reVendorVue = /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/;
  const reVendorRx = /[\\/]node_modules[\\/](rxjs)[\\/]/;
  const reVendorCore = /[\\/]node_modules[\\/](core-js|moment)[\\/]/;
  const reVendorOther = function reVendorOther(module) {
    return (
      /[\\/]node_modules[\\/]/.test(module.resource) &&
      !reVendorReact.test(module.resource) &&
      !reVendorVue.test(module.resource) &&
      !reVendorRx.test(module.resource) &&
      !reVendorCore.test(module.resource)
    );
  };
  webpackConfig.optimization = {
    minimize: envConf.output.compress,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 100000,
      maxSize: 900000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: '-',
      name: false,
      cacheGroups: {
        vendors: {
          test: reVendorOther,
          priority: -10,
          name: 'vendor'
        },
        react: {
          test: reVendorReact,
          priority: 0,
          name: 'vendor-rect'
        },
        vue: {
          test: reVendorVue,
          priority: 0,
          name: 'vendor-vue'
        },
        rxjs: {
          test: reVendorRx,
          priority: 0,
          name: 'vendor-rxjs'
        },
        core: {
          test: reVendorCore,
          priority: 0,
          name: 'vendor-core'
        }
      }
    }
  };

  // plugins
  const plugins = [
    // extract css
    new MiniCssExtractPlugin({
      filename: !isProduction ? '[name].css' : '[name].[hash].css',
      chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css'
    })
  ];
  // vue
  if (envConf.plugin.vue) {
    plugins.push(new VueLoaderPlugin());
  }
  // defines
  plugins.push(new webpack.DefinePlugin(envConf.define));
  // copy publics
  plugins.push(new CopyWebpackPlugin(envConf.public.copyList));
  // html plugin
  envConf.entry.html.forEach((obj) => {
    plugins.push(new HtmlWebpackPlugin(obj));
  });
  // production
  if (isProduction) {
    plugins.push(new OptimizeCSSAssetsPlugin({}));
  }
  // not porduction
  if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin({}));
  }

  webpackConfig.plugins = plugins;

  return webpackConfig;
};
