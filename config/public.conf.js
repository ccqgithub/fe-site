/**
 * Output配置
 * 配置不同环境的打包发布参数
 */

const path = require('path');
const APP_ENV = process.env.APP_ENV || 'dev';

/* === config start === */
const COMMON_CONF = {
  // 输出目录
  distPath: path.join(__dirname, '../dist'),
  // public path
  publicPath: '/fe-static/',
  // 是否输出source map
  sourceMap: true,
  // 是否压缩
  compress: false,
  // 是否清理产出目录distPath
  clear: false
}

const ENV_CONF = {
  // dev
  dev: {
    clear: true,
    compress: false
  },
  // prod
  prod: {
    clear: false,
    compress: true
  }
}
/* === config end === */

// module.exports
module.exports = Object.assign({}, COMMON_CONF, ENV_CONF[APP_ENV]);
