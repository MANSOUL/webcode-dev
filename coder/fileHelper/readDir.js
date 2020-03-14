const path = require('path')
const fs = require('fs')
const hash = require('../core/hash')

const sortFolder = arrs => {
  let files = [], folders = []
  arrs.forEach(a => {
    if (a.type === 'file') {
      files.push(a)
    } else {
      folders.push(a)
    }
  })
  files.sort((a, b) => a.name.localeCompare(b.name))
  folders.sort((a, b) => a.name.localeCompare(b.name))
  return [...folders, ...files]
}

const getFilePath = (dir, fp) => {
  return path.resolve(dir, fp)
}

const getRelativePath = (basePath, absolutePath) => {
  return path.relative(basePath, absolutePath)
}

const readFolder = (fp, folder, basePath) => {
  const files = fs.readdirSync(fp)
  const children = []
  files.forEach(file => {
    const fPath = getFilePath(fp, file)
    const relative = getRelativePath(basePath, fPath)
    const myFile = {
      id: hash(relative),
      relative,
      name: file,
      children: [],
      type: 'file'
    }
    if (fs.lstatSync(fPath).isDirectory()) {
      myFile.type = 'folder'
      readFolder(fPath, myFile, basePath)
    }
    children.push(myFile)
  })
  folder.children = sortFolder(children)
}

const read = fp => {
  const basename = path.basename(fp)
  const basePath = fp
  const root = {
    id: hash(''),
    relative: '',
    name: basename,
    children: [],
    type: 'folder'
  }
  readFolder(fp, root, basePath)
  return root
}

module.exports = read