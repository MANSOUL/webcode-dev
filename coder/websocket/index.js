const WebSocket = require('ws')
const url = require('url')
const ttyHandler = require('./tty/handler')
const fileHandler = require('./file/handler')

module.exports = function connectWebSocket(server) {
  const ttyWs = new WebSocket.Server({
    noServer: true
  })
  const fileWs = new WebSocket.Server({
    noServer: true
  })

  ttyWs.on('connection', ttyHandler)

  fileWs.on('connection', fileHandler)

  server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname
    if (pathname === '/tty') {
      ttyWs.handleUpgrade(request, socket, head, ws => {
        ttyWs.emit('connection', ws, request, {})
      })
    } else if (pathname === '/file') {
      fileWs.handleUpgrade(request, socket, head, ws => {
        fileWs.emit('connection', ws, request, {})
      })
    } else {
      socket.destroy()
    }
  })
}