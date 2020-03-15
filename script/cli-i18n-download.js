#!/usr/bin/env node
const path = require('path');
const { Command } = require('commander');
const download = require('i18n-service-tool/download');

const program = new Command();

program.version('0.0.1');
program.storeOptionsAsProperties(false).passCommandToAction(false);
program
  .name('i18n-download')
  .option('-S, --server <server>', 'i18n server url')
  .option('-l, --locales <locales>', 'locales， join with `,`')
  .option('-s, --site <site>', 'site name')
  .option('-d, --dir <dir>', 'download to...')
  .parse(process.argv);

const { server, locales, site, dir } = program.opts();
const distDir = path.resolve(process.cwd(), dir);

download({
  server,
  site,
  locales: locales.split(','),
  dir: distDir
})
  .then(() => {
    console.log('download i18n success');
  })
  .catch((err) => {
    console.log(err);
    console.log('download i18n error');
  });
