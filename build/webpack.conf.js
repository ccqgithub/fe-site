const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PlaceAssetsPlugin = require('html-webpack-place-assets-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const getStyleLoaders = require('./lib/style-loader').getStyleLoaders;
const findEntry = require('./lib/find-entry');

// configs
const defines = require('../config/define.conf');
const publicConf = require('../config/public.conf');

// is production
const isProduction = process.env.NODE_ENV === 'production';
// context path
const contextPath = path.resolve(__dirname, '../src/');

// ====================================================================
// get all style loaders: css, less, sass, stylus, postcss
// ====================================================================
const styleLoaders = getStyleLoaders({
  compress: publicConf.compress,
  sourceMap: publicConf.sourceMap,
  extractCss: isProduction,
  // use vue-style-loader
  vueStyleOptions: {},
  postcssOptions: {
    config: {
      path: path.resolve(__dirname, './postcss.config.js'),
    },
  },
  lessOptions: {
    strictMath: 'off',
  },
});

// ====================================================================
// cache loader options
// ====================================================================
const cacheLoaderOptions = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: path.resolve(__dirname, '../.cache-loader'),
  },
};

// ====================================================================
// babel loader options
// ====================================================================
const babelLoaderOptions = {
  loader: 'babel-loader',
};

// ====================================================================
// string replace loader options:
// definePlugin not useable in html,
// so use string replace instead, strtof 'REPLACE_' defines
// ====================================================================
const stringReplaceLoaderOptions = [];
Object.keys(defines).forEach((key) => {
  if (key.indexOf('REPLACE_') !== 0) return;
  stringReplaceLoaderOptions.push({
    search: `\\$\\{${key}\\}`,
    replace: defines[key],
    flags: 'g',
  });
});

// ====================================================================
// find all entries, and config one template for every entry
// ====================================================================
const entryConfigs = findEntry({
  // contextDir
  contextPath,
  // entryDir
  entryDirs: [path.resolve(contextPath, 'entry/')],
  // template for entry js
  template(p) {
    return p.replace(/.*entry\/(.*)\.(js|jsx)$/, 'html/$1.html');
  },
});

const entries = entryConfigs.entries;
const templates = entryConfigs.templates;
const entryObj = {};
// hot reload entry
const hotReloadEntry = [
  `webpack-hot-middleware/client?reload=false&path=${
    publicConf.publicPath
  }__webpack_hmr`,
];

Object.keys(entries).forEach((key) => {
  let item = entries[key];
  entryObj[item] = isProduction
    ? `./${item}`
    : hotReloadEntry.concat(`./${item}`);
});

// ====================================================================
// html webpack plugin options
// one instance for one template
// one template for one entry js
// not use htmlWebPackPlugin's inject, but use `html-webpack-place-assets-plugin`
// to inject all dependecies at the placement
// ====================================================================
const htmlPlugins = [];
// html files
Object.keys(entries).forEach((key) => {
  let item = entries[key];
  let template = `./${templates[item]}`;
  let filename = template.replace(/.*html\/(.*)\.html$/, '$1.html');

  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template,
      filename,
      entry: item,
      inject: false,
    }),
  );
});

// ====================================================================
// exports configuration
// ====================================================================

// exports
const configExports = {};

// devtool;
configExports.devtool = 'source-map';

// config exports
configExports.mode = isProduction ? 'production' : 'development';
configExports.context = contextPath;
configExports.entry = entryObj;
configExports.output = {
  path: publicConf.distPath,
  filename: 'js/[name].[hash].js',
  publicPath: publicConf.publicPath,
};

// resolve
configExports.resolve = {
  modules: ['node_modules', path.resolve(contextPath, '../node_modules')],
  extensions: ['.js', '.jsx', '.vue', '.json', '.less', '.scss'],
  alias: {
    //
  },
};

// module
configExports.module = {
  rules: [
    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: {
            attrs: ['img:src'],
            minimize: true,
            removeComments: false,
            collapseWhitespace: false,
            removeAttributeQuotes: false,
            interpolate: 'require',
          },
        },
        {
          loader: 'string-replace-loader',
          options: {
            multiple: stringReplaceLoaderOptions,
          },
        },
      ],
    },
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.less$/,
      use: styleLoaders.loaders.less,
    },
    {
      test: /\.css$/,
      use: styleLoaders.loaders.css,
    },
    {
      test: /\.scss$/,
      use: styleLoaders.loaders.sass,
    },
    {
      test: /\.js$/,
      use: [cacheLoaderOptions, babelLoaderOptions],
    },
    {
      test: /\.jsx$/,
      use: [cacheLoaderOptions, babelLoaderOptions],
    },
    {
      test: /\.babelrc$/,
      use: 'json-loader',
    },
    {
      test: /\.(ico|png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'imgs/[path][name].[hash].[ext]',
      },
    },
    {
      test: /\.(mp3|mp4)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        name: 'medias/[path][name].[hash].[ext]',
      },
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[path][name].[hash].[ext]',
      },
    },
  ],
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
configExports.optimization = {
  minimize: publicConf.compress,
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true, // set to true if you want JS source maps
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin({}),
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
        name: 'vendor',
      },
      react: {
        test: reVendorReact,
        priority: 0,
        name: 'vendor-rect',
      },
      vue: {
        test: reVendorVue,
        priority: 0,
        name: 'vendor-vue',
      },
      rxjs: {
        test: reVendorRx,
        priority: 0,
        name: 'vendor-rxjs',
      },
      core: {
        test: reVendorCore,
        priority: 0,
        name: 'vendor-core',
      },
    },
  },
};

// plugins
configExports.plugins = [
  // vue loader
  new VueLoaderPlugin(),

  // new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin(defines),

  // copy root
  new CopyWebpackPlugin([
    {
      from: path.resolve(contextPath, '../root'),
      to: path.resolve(publicConf.distPath),
      ignore: ['.*'],
    },
  ]),

  // extract css
  new MiniCssExtractPlugin({
    filename: !isProduction ? '[name].css' : '[name].[hash].css',
    chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css',
  }),
]
  // html webpack plugin
  .concat(htmlPlugins)
  // inject assets in html at the replacement
  .concat([
    new PlaceAssetsPlugin({
      headReplaceExp: /<!-- html-webpack-plugin-css -->/,
      bodyReplaceExp: /<!-- html-webpack-plugin-script -->/,
      tagsJoin: '\n  ',
    }),
  ])
  // hot reload
  .concat(isProduction ? [] : new webpack.HotModuleReplacementPlugin({}));

module.exports = configExports;
