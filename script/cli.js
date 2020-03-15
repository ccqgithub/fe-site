#!/usr/bin/env node
const { Command } = require('commander');

const program = new Command();

program.storeOptionsAsProperties(false).passCommandToAction(false);
program.version('0.0.1');

program
  .command('dev <env>', 'start dev server')
  .command('build <env>', 'build production')
  .command('i18n-download', 'download i18n data')
  .parse(process.argv);
