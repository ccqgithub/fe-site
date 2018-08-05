/**
 * 常量配置
 * 用于配置 webpack.DefinePlugin
 */

const APP_ENV = process.env.APP_ENV || 'dev';
const NODE_ENV = process.env.NODE_ENV || 'development';
const prjConf = require('./project.conf');

/* === config start === */
// common
const COMMON_CONF = {
  'GOOGLE_MAP_AK': JSON.stringify('cjxzljSfdfdsfdsmfdmsfdsxxxxx'),
  'GITHUB_API_BASEURL': JSON.stringify('https://www.github.com/'),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'PUBLIC_PATH': JSON.stringify('/fe-static/'),

  // for: string-replace-loader
  'REPLACE_PUBLIC_PATH': '/fe-static/',
  'REPLACE_I18N_CONFIG': JSON.stringify(prjConf.i18n)
}

// envs
const ENV_CONF = {
  // dev
  dev: {
    'API_BASEURL': JSON.stringify('https://xxx.api.com/')
  },
  // prod
  prod: {
    'API_BASEURL': JSON.stringify('https://xxx.api.com/')
  }
}
/* === config end === */

// module.exports
module.exports = Object.assign({}, COMMON_CONF, ENV_CONF[APP_ENV]);
