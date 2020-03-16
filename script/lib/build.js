#!/usr/bin/env node

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

module.exports = (envArgs) => {
  const envConf = require('./env.conf')(envArgs);
  const webpackConf = require('./webpack.conf')(envArgs);

  const checkClear = (callback) => {
    if (!envConf.output.clear) return callback();
    rm(path.join(envConf.output.distPath), (err) => {
      if (err) throw err;
      callback();
    });
  };

  let spinner = ora('building for production...');
  spinner.start();

  checkClear(() => {
    webpack(webpackConf, (err, stats) => {
      spinner.stop();

      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        info.errors.forEach((error) => {
          console.error(error);
        });
      }

      if (stats.hasWarnings()) {
        info.warnings.forEach((warn) => {
          console.warn(warn);
        });
      }

      process.stdout.write(
        `${stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        })}\n\n`
      );

      console.log(chalk.cyan('  Build complete.\n'));
      console.log(
        chalk.yellow(
          '  Tip: built files are meant to be served over an HTTP server.\n' +
            "  Opening index.html over file:// won't work.\n"
        )
      );
    });
  });
};
