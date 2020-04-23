const opn = require('opn')

module.exports.openBrowser = function(url, options = {}) {
  return opn(url, options)
}
