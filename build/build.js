/**
 * 生产环节 构建入口
 * node build/build.js
 */

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');

// config
const publicConf = require('../config/public.conf');

// 清理目录
function clear(callback) {
  if (!publicConf.clear) return callback();

  rm(path.join(publicConf.distPath), (err) => {
    if (err) throw err;
    callback();
  });
}

let spinner = ora('building for production...');
spinner.start();

clear(() => {
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;

    process.stdout.write(
      `${stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      })}\n\n`,
    );

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n",
      ),
    );
  });
});
