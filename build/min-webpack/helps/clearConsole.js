/***
 * @Author:xiawen
 * @Date:2020-04-24 11:08:52
 * @LastModifiedBy:xiawen
 * @Last Modified time:2020-04-24 11:08:52
 */

module.exports = function() {
  if (process.env.CLEAR_CONSOLE !== 'none') {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
  }
}
