const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
const {
  readFile,
  writeFile
} = require('../fileHelper/crudFile')
const {
  getProjectPath
} = require('../fileHelper/project')
const projectDir = getProjectPath()
const send = require('koa-send')
const isImage = require('is-image')

/**
 * 获取项目的文件内容
 */
router.get('/api/file/:project', async ctx => {
  const {
    project
  } = ctx.params
  const {
    relative,
    base64
  } = ctx.query
  const filePath = path.resolve(projectDir, project, relative)
  if (base64) {
    // console.log(filePath)
    // await send(ctx, `../${project}/${relative}`)
    ctx.body = fs.createReadStream(filePath)
  } else {
    const fileContent = readFile(filePath)
    ctx.body = {
      status: 200,
      data: {
        content: fileContent
      }
    }
  }
})

router.put('/api/file/:project', ctx => {
  const {
    project
  } = ctx.params
  const {
    relative
  } = ctx.query
  const {
    content
  } = ctx.request.body
  const filePath = path.resolve(projectDir, project, relative)
  writeFile(filePath, content)
  ctx.body = {
    status: 200,
    data: {}
  }
})

module.exports = router