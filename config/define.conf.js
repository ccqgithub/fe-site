/**
 * 常量配置
 * 用于配置 webpack.DefinePlugin
 */

const APP_ENV = process.env.APP_ENV || 'dev';
const NODE_ENV = process.env.NODE_ENV || 'development';
const prjConf = require('./project.conf');
const defines = {};

// common
let common = {
  'GOOGLE_MAP_AK': JSON.stringify('cjxzljSfdfdsfdsmfdmsfdsxxxxx'),
  'GITHUB_API_BASEURL': JSON.stringify('https://www.github.com/'),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'PUBLIC_PATH': JSON.stringify(prjConf.publicPath),

  // for: string-replace-loader
  'REPLACE_PUBLIC_PATH': prjConf.publicPath,
  'REPLACE_I18N_CONFIG': JSON.stringify(prjConf.i18n)
}

/* === ENV CONF === */
defines['dev'] = Object.assign({}, common, {
  'API_BASEURL': JSON.stringify('https://xxx.api.com/')
});

defines['prod'] = Object.assign({}, common, {
  'API_BASEURL': JSON.stringify('https://xxx.api.com/')
});
/* === ENV CONF END === */

// module.exports
module.exports = defines[APP_ENV];
