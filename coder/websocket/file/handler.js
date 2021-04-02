const path = require('path')
const {
  getProjectPath
} = require('../../fileHelper/project')
const projectDir = getProjectPath()
const Editor = require('../../core/editor')
// const {set, get} = require('./redis')

const serialize = data => JSON.stringify(data)
const unserialize = data => {
  if (typeof data === 'string') return JSON.parse(data)
  return data
}

const createReceipt = (ok, receipt) => ({
  ok,
  receipt
})

const db = {}

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
      let receipt = null
      // let changes = unserialize(await get(filePath))
      let changes = db[filePath]
      if (!changes) changes = []
      if (type === 'postall') {
        const {
          versionId,
          startVersionId,
          endVersionId,
          changes: allChanges
        } = change;
        (allChanges.length !== 0) && new Editor(filePath, allChanges, versionId, startVersionId, endVersionId).exec().save()
        changes = []
        receipt = {
          relative,
          type,
          versionId
        }
      } else {
        if (type === 'edit') {
          changes.push(change)
          receipt = {relative, type, versionId: change.versionId}
        } else if(type === 'save') {
          const {
            versionId,
            startVersionId,
            endVersionId
          } = change;
          (changes.length !== 0) && new Editor(filePath, changes, versionId, startVersionId, endVersionId).exec().save()
          changes = []
          receipt = {
            relative,
            type,
            versionId
          }
        }
      }
      // await set(filePath, serialize(changes))
      db[filePath] = changes
      // 发送回执
      ws.send(JSON.stringify(createReceipt(true, receipt)))
    } catch (error) {
      console.log(error)
      ws.send(JSON.stringify(createReceipt(false, {
        relative,
        type
      })))
    }
  })

  ws.on('close', () => {
    console.log('file ws closed')
  })
}