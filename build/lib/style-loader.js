const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * 获取一种css文件的 loader 列表
 * 
 * 使用：
  getStyleLoader('css', {
    // 是否生成 sourceMap
    sourceMap: true,

    // 是否压缩
    compress: true,

    // 是否提取css
    extractCss: false,

    // vue-style-loader options，extractCss为false有效
    vueStyleOptions: null,

    // style-loader options，extractCss为false有效
    styleOptions: null,

    // css-loader options
    cssOptions: null,
    
    // less-loader options
    lessOptions: null,

    // sass-loader options
    sassOptions: null,

    // stylus-loader options
    stylusOptions: null,

    // postcss-loader options
    postcssOptions: null,
  });

  返回：
  [
    MiniCssExtractPlugin.loader or css loader,
    css loader,
    ?postcss loader,
    less / sass / stylues loader
  ]
 */
exports.getStyleLoader = function getStyleLoader(loader, conf) {
  // config
  const config = Object.assign(
    {
      // sourceMap
      sourceMap: true,
      // compress
      compress: true,
      // 提取css
      extractCss: false,
      // style-loader options
      styleOptions: null,
      // css-loader options
      cssOptions: null,
      // less-loader options
      lessOptions: null,
      // sass-loader options
      sassOptions: null,
      // stylus-loader options
      stylusOptions: null,
      // postcss-loader options
      postcssOptions: null,
    },
    conf,
  );

  // style-loader
  let styleLoader = {
    loader: 'style-loader',
    options: Object.assign(
      {
        sourceMap: config.sourceMap,
      },
      config.styleOptions,
    ),
  };

  // use vue-style-loader replace with style-loader
  if (config.vueStyleOptions) {
    styleLoader = {
      loader: 'vue-style-loader',
      options: Object.assign(
        {
          sourceMap: config.sourceMap,
        },
        config.vueStyleOptions,
      ),
    };
  }

  // css loader
  let cssLoader = {
    loader: 'css-loader',
    options: Object.assign(
      {
        importLoaders: 0,
        sourceMap: config.sourceMap,
      },
      config.cssOptions,
    ),
  };

  // loaders
  let loaders = [
    config.extractCss ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
  ];

  // postcss file
  if (config.postcssOptions || loader === 'postcss') {
    loaders.push({
      loader: 'postcss-loader',
      options: Object.assign(
        {
          sourceMap: config.sourceMap,
        },
        config.postcssOptions,
      ),
    });
  }

  // preprocess loader exclude postcss
  if (loader !== 'postcss' && loader !== 'css') {
    loaders.push({
      loader: `${loader}-loader`,
      options: Object.assign(
        {
          sourceMap: config.sourceMap,
        },
        config[`${loader}Options`],
      ),
    });
  }

  return { loaders };
};

/**
 * 获取各种css语言的 loader
 */
exports.getStyleLoaders = function getStyleLoaders(config) {
  let cssLoader = exports.getStyleLoader('css', config);
  let sassLoader = exports.getStyleLoader('sass', config);
  let lessLoader = exports.getStyleLoader('less', config);
  let stylusLoader = exports.getStyleLoader('stylus', config);
  let postcssLoader = exports.getStyleLoader('postcss', config);

  return {
    loaders: {
      css: cssLoader.loaders,
      sass: sassLoader.loaders,
      less: lessLoader.loaders,
      stylus: stylusLoader.loaders,
      postcss: postcssLoader.loaders,
    },
  };
};
