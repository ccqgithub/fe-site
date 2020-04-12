#!/usr/bin/env node
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

module.exports = (envArgs) => {
  const envConf = require('./env.conf')(envArgs);
  const webpackConf = require('./webpack.conf')(envArgs);

  // clear dist path
  const checkClear = (callback) => {
    if (!envConf.output.clear) return callback();
    rm(path.join(envConf.output.distPath), (err) => {
      if (err) throw err;
      callback();
    });
  };

  // show webpack result
  const showInfo = (err, stats) => {
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
  };

  // dev server
  const callDevServer = () => {
    const compiler = webpack(webpackConf);
    const server = new WebpackDevServer(compiler, envConf.devServer);
    server.listen(envConf.devServer.port, '127.0.0.1', () => {
      console.log(
        `Starting server on http://localhost:${envConf.devServer.port}`
      );
    });
  };

  // watch
  const callWatch = () => {
    const compiler = webpack(webpackConf);
    compiler.watch({}, (err, stats) => {
      showInfo(err, stats);
    });
  };

  const callBuild = () => {
    let spinner = ora('building for production...');
    spinner.start();
    const compiler = webpack(webpackConf);
    compiler.run((err, stats) => {
      spinner.stop();
      showInfo(err, stats);

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
  };

  checkClear(() => {
    if (envArgs.server) {
      return callDevServer();
    }

    if (envArgs.watch) {
      return callWatch();
    }

    return callBuild();
  });
};
