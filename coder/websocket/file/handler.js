const path = require('path')
const {
  getProjectPath
} = require('../../fileHelper/project')
const projectDir = getProjectPath()
const Editor = require('../../core/editor')
const {set, get} = require('./redis')

const serialize = data => JSON.stringify(data)
const unserialize = data => {
  if (typeof data === 'string') return JSON.parse(data)
  return data
}

module.exports = ws => {
  ws.on('message', async message => {
    const data = JSON.parse(message)
    const {
      relative,
      project,
      type,
      change
    } = data
    const filePath = path.resolve(projectDir, project, relative)

    try {
      let changes = unserialize(await get(filePath))
      let receipt = null
      if (!changes) changes = []
      if (type === 'edit') {
        changes.push(change)
        receipt = {relative, type, versionId: change.versionId}
      } else {
        const versionId = change.versionId
        if (versionId !== changes.slice(-1)[0].versionId + 1) {
          console.log('文件操作序列有误')
          return
        }
        (changes.length !== 0) && new Editor(filePath, changes).exec().save()
        changes = []
        receipt = {
          relative,
          type,
          versionId
        }
      }
      await set(filePath, serialize(changes))
      // 发送回执
      ws.send(JSON.stringify(receipt))
    } catch (error) {
      console.log(error)
    }
  })

  ws.on('close', () => {
    console.log('file ws closed')
  })
}