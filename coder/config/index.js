const defaultConfig = require('./default')
const productionConfig = require('./production')

/**
 * 获取不同环境下的配置
 * @param {String} key 
 */
module.exports = function getConfig(key) {
  let value = process.env.NODE_ENV === 'production' ? productionConfig[key] : defaultConfig[key]
  if (!value) {
    value = defaultConfig[key]
  }
  return value
}