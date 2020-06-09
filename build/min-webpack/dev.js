const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('./helpers/openBrowser')
const choosePort = require('./helpers/choosePort')
const chalk = require('chalk')
const { send, STARTING, COMPILING, DONE } = require('./helpers/send')
const { createCompiler, prepareUrls } = require('./helpers/webpackDevServer')
const clearConsole = require('./helpers/clearConsole')
const { getConfig } = require('./helpers/getConfig')

// port 1024 => 65535
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000
const HOST = process.env.HOST || '0.0.0.0'
const PROTOCOL = process.env.HTTPS ? 'https' : 'http'
const isInteractive = process.stdout.isTTY

const userConfig = getConfig()
const T = () => {}

module.exports = function(opts = {}) {
  const {
    webpackConfig,
    onCompileDone = T,
    onCompileInvalid = T,
    beforeServer,
    afterServer,
    extraMiddlewares,
    beforeServerWithApp,
    proxy,
    historyApiFallback = {
      disableDotRule: true
    }
  } = opts || {}

  if (!webpackConfig) {
    throw new Error('必须提供 webpackConfig 配置项')
  }

  choosePort(DEFAULT_PORT)
    .then(port => {
      if (port === null) {
        return
      }

      const urls = prepareUrls(PROTOCOL, HOST, port)
      const compiler = createCompiler(webpack, webpackConfig, 'Your App', urls)

      const timefix = 11000
      compiler.plugin('watch-run', (watching, callback) => {
        watching.startTime += timefix
        callback()
      })
      compiler.plugin('done', stats => {
        send({ type: DONE })
        stats.startTime -= timefix
        onCompileDone()
      })
      compiler.plugin('invalid', () => {
        send({ type: COMPILING })
        onCompileInvalid()
      })
      const serverConfig = {
        disableHostCheck: true,
        compress: true,
        clientLogLevel: 'none',
        hot: true,
        quiet: true,
        headers: {
          'access-control-allow-origin': '*'
        },
        watchOptions: {
          ignored: /node_modules/
        },
        historyApiFallback,
        overlay: false,
        host: HOST,
        proxy,
        https: !!process.env.HTTPS,
        before(app) {
          if (beforeServerWithApp) {
            beforeServerWithApp(app)
          }
        },
        after(app) {
          if (extraMiddlewares) {
            extraMiddlewares.forEach(middleware => {
              app.use(middleware)
            })
          }
        }
      }
      const devServer = new WebpackDevServer(compiler, serverConfig)

      if (beforeServer) {
        beforeServer(devServer)
      }

      devServer.listen(port, HOST, err => {
        if (err) {
          console.log(err)
          return
        }
        if (isInteractive) {
          clearConsole()
        }
        console.log(chalk.cyan('\nStarting the development server...\n'))
        if (userConfig.devServer.open) {
          openBrowser(urls.localUrlForBrowser)
        }
        send({ type: STARTING })
        if (afterServer) {
          afterServer(devServer)
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}
