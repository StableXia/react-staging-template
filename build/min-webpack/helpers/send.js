const debug = require('debug')('min-webpack:send')

module.exports.COMPILING = 'COMPILING'
module.exports.DONE = 'DONE'
module.exports.STARTING = 'STARTING'
module.exports.RESTART = 'RESTART'
module.exports.OPEN_FILE = 'OPEN_FILE'

module.exports.send = function send(message) {
  if (process.send) {
    debug(`send ${JSON.stringify(message)}`)
    process.send(message)
  }
}
