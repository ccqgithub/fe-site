#!/usr/bin/env node
const path = require('path');
const { Command } = require('commander');

const program = new Command();

program.version('0.0.1');
program.storeOptionsAsProperties(false).passCommandToAction(false);
program
  .name('build')
  .option('-a, --app-env <appEnv>', 'app env')
  .option('-n, --node-env <nodeEnv>', 'node env')
  .option('-r, --root', 'root')
  .parse(process.argv);

const { appEnv, nodeEnv, root } = program.opts();

// set env
process.env.NODE_ENV = nodeEnv;
process.env.APP_ENV = appEnv;

const siteRoot = path.resolve(process.cwd(), root);
const envArgs = { appEnv, nodeEnv, root: siteRoot };

require('./lib/build')(envArgs);
