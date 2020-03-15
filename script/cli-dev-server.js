#!/usr/bin/env node
const path = require('path');
const { Command } = require('commander');

const program = new Command();

program.storeOptionsAsProperties(false).passCommandToAction(false);
program.version('0.0.1');

program
  .name('build')
  .option('-a, --app-env <appEnv>', 'app env', 'dev')
  .option('-n, --node-env <nodeEnv>', 'node env', 'development')
  .option('-r, --root <siteRoot>', 'root', process.cwd())
  .parse(process.argv);

const { appEnv, nodeEnv, root } = program.opts();

// set env
process.env.NODE_ENV = nodeEnv;
process.env.APP_ENV = appEnv;

const siteRoot = path.resolve(process.cwd(), root);
const envArgs = { appEnv, nodeEnv, root: siteRoot, onlyServer: true };

require('./lib/dev-server')(envArgs);
