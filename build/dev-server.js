/**
 * dev-server entry
 */
const path = require('path');
const rm = require('rimraf');
const Koa = require('koa');
const staticServe = require('koa-static');
const rewrite = require('koa-rewrite');
const proxy = require('koa-proxy');
const cors = require('@koa/cors');
const escapeStringRegexp = require('escape-string-regexp');
const webpack = require('webpack');
const hotMiddleware = require('koa-webpack-hot');

const webpackConfig = require('./webpack.conf');
const publicConf = require('../config/public.conf');
const prjConf = require('../config/project.conf');

const devServerConf = prjConf.devServer;
const i18nConf = prjConf.i18n;

// 清理目录
function clearDist(callback) {
  if (!publicConf.clear) return callback();

  rm(path.join(publicConf.distPath), (err) => {
    if (err) throw err;
    callback();
  });
}

// new app
const app = new Koa();
// 如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
app.proxy = true;
// 默认为2，表示 .subdomains 所忽略的字符偏移量。
app.subdomainOffset = 2;

/* == WEBPACK == */
const compiler = webpack(webpackConfig);
clearDist(() => {
  compiler.watch(
    {
      // config
    },
    (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    },
  );
});

// hot reload socket
app.use(rewrite(/^\/.+\/__webpack_hmr/, '/__webpack_hmr'));
app.use(
  hotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    // heartbeat: 10 * 1000
  }),
);

/* == PROXY == */
// cors
const proxyCors = devServerConf.proxyCors || {};
app.use(
  cors({
    allowHeaders: proxyCors.allowHeaders || [],
    exposeHeaders: proxyCors.exposeHeaders || [],
  }),
);
// proxies
const proxies = devServerConf.proxies;
proxies.forEach((item) => {
  app.use(proxy(item));
});

/* == REWRITES == */
// language rewrite
if (i18nConf.on) {
  let languages = i18nConf.languages || ['zh-CN'];
  let map = i18nConf.map || {};
  let languageArr = languages.concat(Object.keys(map));
  let langRewriteStr = languageArr.join('|');
  app.use(rewrite(new RegExp(`^/(${langRewriteStr})/(.*)$`), '/$2'));
}
// rewrites
let rewrites = devServerConf.rewrites;
rewrites.forEach((item) => {
  app.use(rewrite(item[0], item[1]));
});

/* == REWRITE PUBLIC PATH TO DIST  == */
if (publicConf.publicPath != '/') {
  let publicPath = escapeStringRegexp(publicConf.publicPath);
  let exp = new RegExp(`^${publicPath}(.+)$`);
  app.use(rewrite(exp, '/$1'));
}

/* == DIST STATIC  == */
app.use(staticServe(publicConf.distPath));

/* == NOT FOUND  == */
app.use(async (ctx) => {
  console.log('404', ctx.path);
  ctx.throw('Not Found!', 404);
});

/* == LISTEN  == */
app.listen(devServerConf.port);
