const http = require('http')
const Koa = require('koa')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const applyRoutes = require('./routes')
const config = require('./config')
const connectWebSocket = require('./websocket')

const app = new Koa()
const server = http.createServer(app.callback())

// error captch
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log('catch an error:', error)
    ctx.body = {
      status: 400,
      errorMessage: error.toString()
    }
  }
})

// form handler
app.use(koaBody({
  multipart: true
}))

// reoutes
applyRoutes(app)

// server static files
app.use(koaStatic('static', {
  // maxage: 30 * 24 * 60 * 60 * 1000
}))

connectWebSocket(server)

server.listen(config('port'), () => {
  console.log(`🚀 Server ready at http://localhost:${config('port')}`)
})