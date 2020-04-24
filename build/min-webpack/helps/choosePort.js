/***
 * @Author:xiawen
 * @Date:2020-04-24 11:03:13
 * @LastModifiedBy:xiawen
 * @Last Modified time:2020-04-24 13:25:21
 */

const detect = require('detect-port')
const inquirer = require('inquirer')
const isRoot = require('is-root')
const chalk = require('chalk')
const getProcessForPort = require('./getProcessForPort')
const clearConsole = require('./clearConsole')

const isInteractive = process.stdout.isTTY

module.exports = function(defaultPort) {
  if (process.env.DETECT_PORT === 'none') {
    return defaultPort
  }

  return detect(defaultPort)
    .then(async port => {
      if (port === defaultPort) {
        return port
      }

      const message =
        process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
          ? `Admin permissions are required to run a server on a port below 1024.`
          : `Something is already running on port ${defaultPort}.`

      if (isInteractive) {
        clearConsole()
        const existingProcess = getProcessForPort(defaultPort)
        const question = {
          type: 'confirm',
          name: 'shouldChangePort',
          message: `${chalk.yellow(
            `message${existingProcess ? ` Probably:\n  ${existingProcess}` : ''}`
          )}\n\nWould you like to run the app on another port instead?`,
          default: true
        }
        return await inquirer.prompt(question).then(answer => {
          if (answer.shouldChangePort) {
            return port
          }
          return null
        })
      } else {
        console.log(chalk.red(message))
        return null
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}
