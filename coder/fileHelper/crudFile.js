const nodePath = require('path')
const fs = require('fs')

const createFile = fp => {
  fs.writeFileSync(fp, '')
}

const writeFile = (fp, content) => {
  fs.writeFileSync(fp, content)
}

const createFolder = fp => {
  if (!fs.existsSync(fp)) {
    fs.mkdirSync(fp)
  }
}

const readFile = fp => {
  if (fs.lstatSync(fp).isFile()) {
    return fs.readFileSync(fp, 'utf8')
  }
  return ''
}

const removeFile = path => {
  if (!fs.existsSync(path)) return

  if (fs.statSync(path).isFile()) {
    fs.unlinkSync(path)
    return
  }

  const files = fs.readdirSync(path)
  files.forEach(file => {
    const absPath = nodePath.resolve(path, file)
    removeFile(absPath)
  })

  fs.rmdirSync(path)
}

const renameFile = (from, to) => {
  fs.renameSync(from, to)
}

module.exports.createFile = createFile
module.exports.createFolder = createFolder
module.exports.readFile = readFile
module.exports.removeFile = removeFile
module.exports.renameFile = renameFile
module.exports.writeFile = writeFile