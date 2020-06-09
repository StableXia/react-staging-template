const test = require('ava')
const dev = require('../build/min-webpack/dev.js')

test('webpack dev func', t => {
  t.throws(dev)
})
