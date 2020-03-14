const upload = require('./upload')
const auth = require('./auth')
const project = require('./project')
const file = require('./file')

/**
 * 应用路由
 * @param {Koa} app 
 */
function applyRoutes(app) {
  app.use(upload.routes())
  app.use(auth.routes())
  app.use(project.routes())
  app.use(file.routes())
}

module.exports = applyRoutes