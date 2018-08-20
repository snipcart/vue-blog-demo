'use strict'
require('./check-versions')()
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const webpack = require('webpack')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const config = require('../config')
const copyFiles = config.build.copyFiles
const assetsRoot = config.build.assetsRoot
const webpackConfig = require('./webpack.prod.conf')

const fileContent = fs.readFileSync(path.resolve(__dirname, '..', 'static', 'api', 'feed.json'));
const feed = JSON.parse(fileContent);
const prenderedRoutes = feed.results.map(x => `/read/${x.id}`);

prenderedRoutes.unshift('/');

webpackConfig.plugins.push(
  new PrerenderSPAPlugin({
    staticDir: path.resolve(__dirname, '..', 'dist'),
    routes: prenderedRoutes,
    renderer: new Renderer({
      injectProperty: '__PRERENDER_INJECTED',
      inject: {
        prerendered: true
      },
      renderAfterDocumentEvent: 'app.rendered'
    })
  }));

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    shell.config.silent = true

    Object.keys(copyFiles)
      .forEach(src => shell.cp(
        path.resolve(__dirname, src),
        path.resolve(assetsRoot, copyFiles[src])
      ))

    shell.config.silent = false

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
