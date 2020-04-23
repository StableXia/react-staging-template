// const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const webpack = require('webpack')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { openBrowser } = require('./utils/open-browser.util')

const devWebpackConfig = {
  mode: 'development',
  entry: {
    app: './src/index.tsx'
  },
  // output: {
  //   filename: '[name].[hash:8].js',
  //   path: path.resolve(__dirname, '../dist')
  // },
  devServer: {
    // contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    // hotOnly: false,
    hot: true,
    port: 8002,
    host: '0.0.0.0',
    inline: true,
    open: false
    // disableHostCheck: true
    // overlay: {
    //   warnings: true,
    //   errors: true
    // }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
    // new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 8002
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devWebpackConfig.devServer.port = port
      devWebpackConfig.devServer.after = () => openBrowser(`http://localhost:${port}`)

      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://localhost:${port}`]
          },
          onErrors: undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
