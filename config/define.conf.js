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
  PUBLIC_PATH: JSON.stringify('/fe-static/'),
  I18N_CONFIG: JSON.stringify(prjConf.i18n),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'process.env.APP_ENV': JSON.stringify(APP_ENV)
};

// envs
const ENV_CONF = {
  // dev
  dev: {
    API_BASEURL: JSON.stringify('https://xxx.api.com/')
  },
  // prod
  prod: {
    API_BASEURL: JSON.stringify('https://xxx.api.com/')
  }
};
/* === config end === */

// module.exports
module.exports = { ...COMMON_CONF, ...ENV_CONF[APP_ENV] };
