/**
 * Output配置
 * 配置不同环境的打包发布参数
 */

const path = require('path');
const APP_ENV = process.env.APP_ENV || 'dev';
const prjConf = require('./project.conf');
const configs = {};

// common
let common = {
  // 输出目录
  distPath: path.join(__dirname, '../dist'),
  // public path
  publicPath: prjConf.publicPath,
  // 是否输出source map
  sourceMap: true,
  // 是否压缩
  compress: false,
  // 是否清理产出目录distPath
  clear: false
}

/* === ENV CONF === */
configs['dev'] = Object.assign({}, common, {
  clear: true,
  compress: false,
});

configs['prod'] = Object.assign({}, common, {
  clear: false,
  compress: true,
});
/* === ENV CONF END === */

// module.exports
module.exports = configs[APP_ENV];
