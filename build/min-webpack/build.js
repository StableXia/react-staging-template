const webpack = require('webpack')
const chalk = require('chalk')
const rimraf = require('rimraf')
const formatWebpackMessages = require('./helpers/formatWebpackMessages')

// process.env.DEBUG = 'min-webpack:build'
const debug = require('debug')('min-webpack:build')

function buildWebpack(opts = {}) {
  const { webpackConfig, watch, success, fail } = opts

  debug(`webpack config: ${JSON.stringify(webpackConfig)}`)
  debug(`Clean output path ${webpackConfig.output.path.replace(`${process.cwd()}/`, '')}`)

  rimraf.sync(webpackConfig.output.path)

  function successHandler({ stats, warnings }) {
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(warnings.join('\n\n'))
    } else {
      console.log(chalk.green('Compiled successfully.\n'))
    }

    console.log('File sizes after gzip:\n')
    // TODO: 打印构建文件信息

    if (success) {
      success({ stats, warnings })
    }
  }

  function errorHandler(err) {
    console.log(chalk.red('Failed to compile.\n'))
    // TODO: 打印构建失败信息
    console.log(err)
    debug(err)

    if (fail) {
      fail(err)
    }

    if (!watch) {
      process.exit(1)
    }
  }

  function doneHandler(err, stats) {
    debug('build done')

    if (err) {
      return errorHandler(err)
    }

    const messages = formatWebpackMessages(stats.toJson({}, true))

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }

      return errorHandler(new Error(messages.errors.join('\n\n')))
    }

    return successHandler({
      stats,
      warnings: messages.warnings
    })
  }

  const compiler = webpack(webpackConfig)

  if (watch) {
    compiler.watch(200, doneHandler)
  } else {
    compiler.run(doneHandler)
  }
}

module.exports = function(opts = {}) {
  const { webpackConfig } = opts

  if (!webpackConfig) {
    throw new Error('必须提供 webpackConfig 配置项')
  }

  buildWebpack(opts)
}
