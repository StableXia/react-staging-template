const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dev = require('./min-webpack/dev')

const webpackConfig = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, '../src/index.tsx')
  },
  // output: {
  //   filename: '[name].[hash:8].js',
  //   path: path.resolve(__dirname, '../dist')
  // },
  // stats: 'errors-only',
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
  ]
}

dev({ webpackConfig })
