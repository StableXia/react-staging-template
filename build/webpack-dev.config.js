const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack-base.config')
const dev = require('./min-webpack/dev')

const webpackConfig = webpackMerge(webpackBaseConfig, {
  mode: 'development'
})

dev({ webpackConfig })
