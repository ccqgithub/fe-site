const path = require('path');
const webpack = require('webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (envArgs) => {
  const envConf = require('./env.conf')(envArgs);
  const isProduction = envArgs.nodeEnv === 'production';

  // entry js
  const entryObj = {};
  Object.keys(envConf.entry.js).forEach((key) => {
    entryObj[key] = envConf.entry.js[key];
  });

  const webpackConfig = {
    context: envConf.base.context,
    devtool: 'source-map',
    mode: isProduction ? 'production' : 'development',
    entry: entryObj,
    output: {
      path: envConf.output.distPath,
      filename: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
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
  webpackConfig.optimization = {
    minimize: envConf.output.compress,
    minimizer: [new TerserPlugin()],
    runtimeChunk: 'single',
    splitChunks: envConf.output.splitChunks || {}
  };

  // plugins
  const plugins = [
    // extract css
    new MiniCssExtractPlugin({
      filename: !isProduction ? '[name].css' : '[name].[hash].css',
      chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css'
    })
  ];
  // stats.json
  if (envConf.output.statsJson) {
    plugins.push(
      new StatsWriterPlugin({
        stats: {
          all: true
        },
        filename: 'stats.json' // Default
      })
    );
  }
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

  webpackConfig.plugins = plugins;

  return webpackConfig;
};
