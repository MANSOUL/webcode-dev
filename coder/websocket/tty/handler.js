const os = require('os')
const pty = require('node-pty')

module.exports = (ws) => {
  // Initialize node-pty with an appropriate shell
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: process.env
  })
  ptyProcess.on('data', data => {
    ws.send(JSON.stringify(data))
  })

  ws.on('message', message => {
    const data = JSON.parse(message)
    ptyProcess.write(data)
  })

  ws.on('close', () => {
    console.log('tty ws closed')
  })
}