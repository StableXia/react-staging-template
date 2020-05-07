const path = require('path')
const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack-base.config')
const build = require('./min-webpack/build')

const webpackConfig = webpackMerge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    app: './src/index.tsx'
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  }
})

build({ webpackConfig })
