const { join } = require('path')
const { existsSync } = require('fs')
const assert = require('assert')
const slash = require('slash2')

const defaultConfig = {
  publicPath: '/',
  devServer: {
    open: true
  }
}

function getConfigFile() {
  const cwd = process.cwd()

  const files = ['.minrc.js']
  const validFiles = files.filter(f => existsSync(join(cwd, f)))

  assert(
    validFiles.length <= 1,
    `Multiple config files (${validFiles.join(', ')}) were detected, please keep only one.`
  )
  if (validFiles[0]) {
    return slash(join(cwd, validFiles[0]))
  }
}

function deepMerge(obj1, obj2) {
  for (let key in obj2) {
    obj1[key] =
      obj1[key] && obj1[key].toString() === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : (obj1[key] = obj2[key])
  }
  return obj1
}

module.exports.getConfig = () => {
  const file = getConfigFile()

  if (file) {
    return deepMerge(defaultConfig, require(file))
  }

  return defaultConfig
}
