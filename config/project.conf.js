/**
 * 项目配置
 */

module.exports = {
  // dev server 配置: 不能删
  // build/dev-server.js
  devServer: {
    // 端口
    port: 3003,
    // 跨域
    // https://github.com/koajs/cors
    proxyCors: {
      allowHeaders: ['TOKEN', 'Locale', 'content-type'],
      exposeHeaders: ['TOKEN'],
    },
    // https://github.com/popomore/koa-proxy
    proxies: [
      {
        host: 'http://www.xxx.cn',
        match: /^\/xxx\//,
      },
    ],
    // url 重写
    // https://github.com/koajs/rewrite
    rewrites: [
      [/^\/vue(\/.*|$)/, '/vue-app.html'],
      [/^\/react(\/.*|$)/, '/rc-app.html'],
    ],
  },

  // 国际化配置
  i18n: {
    // 开启国际化
    on: true,
    // 语言列表
    languages: ['zh-CN', 'en-US'],
    // 映射语言
    map: {
      zh: 'zh-CN',
      en: 'en-US',
    },
    // 检查语言的顺序
    detects: [
      // /zh-CN/xxx
      'path',
      // /xxx?lang=zh-CN
      'query',
      // localStorage.getItem('lang')
      'store',
      // navigator.language: zh-CN
      'browser',
    ],
    // 默认语言
    default: 'zh-CN',
    // i18n-service 配置
    // https://github.com/ccqgithub/i18n-service
    service: {
      server: 'http://i18n.server.com/',
      site: 'test',
      locales: ['zh-CN', 'en-US'],
    },
  },
};
