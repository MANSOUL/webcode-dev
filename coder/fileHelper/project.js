const path = require('path')

const getProjectPath = () => {
  return path.resolve(process.cwd(), '../projects')
}

module.exports.getProjectPath = getProjectPath