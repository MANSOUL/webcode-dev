const fs = require('fs')

class Editor {
  constructor(path, queue) {
    if (queue.length === 0) {
      throw new Error('无文件操作')
    }
    this.lines = null
    this.path = path
    this.queue = queue
    this.eol = queue[0].eol
    this.regLine = new RegExp(this.eol)
  }

  read() {
    return fs.readFileSync(this.path, 'utf8')
  }

  save() {
    if (!this.lines) return
    fs.writeFileSync(this.path, this.lines.join(this.eol))
    return this
  }

  detect() {
    const queue = this.queue
    let start = queue[0].versionId

    for (let i = 0; i < queue.length; i++) {
      const q = queue[i]
      if (q.versionId !== start) {
        return false
      }
      start++
    }

    return true
  }

  exec() {
    if (!this.detect()) return this
    const content = this.read()
    const lines = content.split(this.regLine)
    const queue = this.queue
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i]
      const change = q.changes[0]
      const text = change.text
      let {startLineNumber, endLineNumber, startColumn, endColumn} = change.range
      startLineNumber--
      endLineNumber--
      startColumn--
      endColumn--
      if (text === '') { //  删除
        const lineCount = Math.abs(endLineNumber - startLineNumber)
        if (lineCount === 0) {
          let startLine = this.execRemoveWord(lines[startLineNumber], startColumn, endColumn)
          lines[startLineNumber] = startLine
        } else {
          lines[startLineNumber] = this.execRemoveWord(lines[startLineNumber], startColumn)
          let endLine = this.execRemoveWord(lines[endLineNumber], 0, endColumn)
          endLine === '' ? this.execRemoveLine(lines, endLineNumber) : (lines[endLineNumber] = endLine)
          if (lineCount > 1) { // 影响多行
            for (let i = startLineNumber + 1; i < endLineNumber; i++) {
              this.execRemoveLine(lines, startLineNumber+1)
            }
          }
        }
      } else {
        if(this.regLine.test(text)) { // 插入的是换行
          if (lines[startLineNumber].length <= startColumn) {
            this.execInsertLine(lines, startLineNumber, text.split(this.regLine)[1])
          }
          else {
            // 如果插入列后面还有文本
            this.execWrapLine(lines, startLineNumber, startColumn)
          }
        } else {
          const lineCount = endLineNumber - startLineNumber
          if (lineCount === 0) { // 单行插入字符
            let nextQ = queue[i + 1]
            let nextQChange = nextQ ? nextQ.changes[0] : undefined
            if (nextQ && (nextQChange.text.length > 1 || nextQChange.range.endColumn > nextQChange.range.startColumn)) {
              // 中文输入法拼音输入
              continue
            }
            lines[startLineNumber] = this.execInsertWord(lines[startLineNumber], startColumn, text)
          } else { // 选择了多行插入，删除行，再插入
            // 删除第一行的某些字符
            lines[startLineNumber] = this.execRemoveWord(lines[startLineNumber], startColumn)
            // 删除最后一行的某些字符
            lines[endLineNumber] = this.execRemoveWord(lines[endLineNumber], 0, endColumn)
            // 插入字符
            lines[startLineNumber] = this.execInsertWord(lines[startLineNumber], startColumn, text)
            // 合并
            this.execCollapseLine(lines, startLineNumber, endLineNumber)
            // 删除中间行
            for (let i = startLineNumber + 1; i <= endLineNumber; i++) {
              this.execRemoveLine(lines, startLineNumber + 1)
            }
          }
        }
      }
    }
    this.lines = lines
    return this
  }

  execInsertWord(line, startColumn, text) {
    const characters = line.split('')
    characters.splice(startColumn , 0, text)
    return characters.join('')
  }
  
  execInsertLine(lines, startLineNumber,  text) {
    // 新增一行，并插入文本
    lines.splice(startLineNumber + 1, 0, text)
  }

  execWrapLine(lines, startLineNumber, startColumn) {
    const characters = lines[startLineNumber].split('')
    // 保留前半部分
    lines[startLineNumber] = characters.slice(0, startColumn).join('')
    // 后半部分换行
    lines.splice(startLineNumber + 1, 0, characters.slice(startColumn).join(''))
  }

  execRemoveWord(line, startColumn, endColumn = line.length){
    const characters = line.split('')
    characters.splice(startColumn, endColumn - startColumn)
    return characters.join('')
  }

  execRemoveLine(lines, no) {
    lines.splice(no, 1)
  }

  execCollapseLine(lines, startLineNumber, endLineNumber) {
    lines[startLineNumber] = lines[startLineNumber] + lines[endLineNumber]
  }
}

module.exports = Editor