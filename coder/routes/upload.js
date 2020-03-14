const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const {
  coverUploadFile
} = require('../core/qiniu')
const config = require('../config')
const router = new Router()

router.post('/upload', async (ctx) => {
  const files = ctx.request.files
  let uploadData = {}
  try {
    for (let key in files) {
      let tempPath = files[key].path
      let filename = files[key].name
      let size = files[key].size

      if (size <= config('uploadLimitSize')) {
        let fname = tempPath.split('/').pop()
        let ext = filename.split('.').pop()
        let distPath = path.resolve(__dirname, `../static/upload/${fname}.${ext}`)
        fs.renameSync(tempPath, distPath)
        uploadData[key] = {
          error: 0,
          path: `/upload/${fname}.${ext}`
        }
      } else {
        uploadData[key] = {
          error: -1,
          errorMessage: `上传文件大小应在${config('uploadLimitSize')}byte 内`
        }
      }
    }
    ctx.body = {
      success: true,
      message: '上传成功！',
      body: uploadData
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      success: false,
      message: '上传失败！',
      body: err
    }
  }
})

router.post('/uploadqn', async (ctx) => {
  const files = ctx.request.files
  let uploadData = {}
  try {
    for (let key in files) {
      let tempPath = files[key].path
      let filename = files[key].name
      let size = files[key].size

      if (size <= config('uploadLimitSize')) {
        let fname = tempPath.split('/').pop()
        let ext = filename.split('.').pop()
        let distPath = path.resolve(__dirname, `../static/upload/${fname}.${ext}`)
        fs.renameSync(tempPath, distPath)
        const resURL = await coverUploadFile(tempPath, `${fname}.${ext}`)
        uploadData[key] = {
          error: 0,
          path: resURL
        }
      } else {
        uploadData[key] = {
          error: -1,
          errorMessage: `上传文件大小应在${config('uploadLimitSize')}byte 内`
        }
      }
    }
    ctx.body = {
      success: true,
      message: '上传成功！',
      body: uploadData
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      success: false,
      message: '上传失败！',
      body: err
    }
  }
})

module.exports = router