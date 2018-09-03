const path = require('path');
const fs = require('fs');

/**
 * 查找入口js文件 entry js
 * 以及入口js对应的模板
 *
 * 使用：
 * let entryConfigs = findEntry({
 *   contextPath: '',
 *   entryDirs: [],
 *   template: (p) => {
 *     return p.replace(/.*app\/script\/entry\/(.*)\.(js|jsx)$/, 'app/template/$1.html')
 *   }
 * });
 *
 * 返回 entryConfigs：
 * {
 *   entries: {
 *     'entry/a.js': 'entry/a.js'
 *   },
 *   templates: {
 *     'entry/a.js': 'template/a.html'
 *   }
 * }
 */
module.exports = function findEntry(conf) {
  let contextPath = conf.contextPath;
  let entryDirs = conf.entryDirs;
  let template = conf.template;
  let files = [];

  if (!contextPath) throw new Error('find entry errir: no contextPath');

  if (!entryDirs) throw new Error('find entry errir: no entryDirs');

  if (!template) throw new Error('find entry errir: no template');

  // 遍历文件夹搜寻 entry 文件
  const walk = (p, fileList = []) => {
    let dirList = fs.readdirSync(p);

    dirList.forEach((item) => {
      let sPath = path.join(p, item);
      let stat = fs.lstatSync(sPath);

      if (stat.isDirectory()) {
        walk(sPath, fileList);
      } else if (stat.isFile()) {
        fileList.push(path.posix.relative(contextPath, sPath));
      }
    });
  };

  // 收集入口文件
  entryDirs.forEach((dir) => walk(dir, files));

  let templates = {};
  let entries = {};

  files.forEach((file) => {
    let tpl = template(file);
    entries[file] = file;
    templates[file] = tpl;
  });

  return {
    entries,
    templates,
  };
};
