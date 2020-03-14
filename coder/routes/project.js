const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
// const {
//   sign,
//   verify
// } = require('../core/jwt')
const router = new Router()
const readDir = require('../fileHelper/readDir')
const {
  getProjectPath
} = require('../fileHelper/project')
const projectDir = getProjectPath()
const {
  createFile,
  createFolder,
  renameFile,
  removeFile
} = require('../fileHelper/crudFile')
const hash = require('../core/hash')

/**
 * 获取所有项目
 */
router.get('/api/project', ctx => {
  const ps = fs.readdirSync(projectDir)
  const projects = ps.map(p => {
    const status = fs.statSync(path.resolve(projectDir, p))
    return {
      name: p,
      createdAt: new Date(status.ctimeMs).getTime()
    }
  })
  ctx.body = {
    status: 200,
    data: {
      projects
    }
  }
})

/**
 * 获取所有项目
 */
router.post('/api/project', ctx => {
  const { name } = ctx.request.body
  if (!/^[a-zA-Z0-9]+$/.test(name)) {
    ctx.body = {
      status: 400,
      errorMessage: '项目名不能为空且只能为字母和数字'
    }
    return
  }
  const dirPath = path.resolve(projectDir, name)
  if (fs.existsSync(dirPath)) {
    ctx.body = {
      status: 400,
      errorMessage: '项目名已存在'
    }
    return
  } 
  fs.mkdirSync(dirPath)
  ctx.body = {
    status: 200
  }
})


/**
 * 获取项目文件树结构
 */
router.get('/api/project/:project', ctx => {
  const project = ctx.params.project
  const projectPath = path.resolve(projectDir, project)
  const fileTree = readDir(projectPath)
  ctx.body = {
    status: 200,
    data: {
      fileTree
    }
  }
})

/**
 * 创建文件或文件夹
 */
router.post('/api/project/:project', ctx => {
  const {
    project
  } = ctx.params
  const {
    relative,
    fileName,
    type = 'file'
  } = ctx.request.body
  const relativePath = path.join(relative, fileName)
  const filePath = path.resolve(projectDir, project, relativePath)
  if (type === 'file') {
    createFile(filePath)
  } else if (type === 'folder') {
    createFolder(filePath)
  }
  ctx.body = {
    status: 200,
    data: {
      file: {
        id: hash(relativePath),
        relative: relativePath,
        name: fileName,
        children: [],
        type,
        content: ''
      }
    }
  }
})

/**
 * 修改项目文件文件名
 */
router.put('/api/project/:project', ctx => {
  const {
    project
  } = ctx.params
  const {
    relative,
    fileName,
    newFileName
  } = ctx.request.body
  const oldPath = path.resolve(projectDir, project, relative, fileName)
  const newPath = path.resolve(projectDir, project, relative, newFileName)
  renameFile(oldPath, newPath)
  ctx.body = {
    status: 200,
    data: {}
  }
})

/**
 * 删除项目文件
 */
router.delete('/api/project/:project', ctx => {
  const {
    project
  } = ctx.params
  const {
    relative,
    fileName
  } = ctx.query
  const filePath = path.resolve(projectDir, project, relative, fileName)
  removeFile(filePath)
  ctx.body = {
    status: 200,
    data: {}
  }
})

module.exports = router