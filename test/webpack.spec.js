const test = require('ava')
const devWebpack = require('../build/min-webpack/dev.js')

test('devWebpack', t => {
  t.throws(devWebpack)
})
