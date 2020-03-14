const Router = require('koa-router')
// const {
//   sign,
//   verify
// } = require('../core/jwt')
const router = new Router()

// router.post('/login', ctx => {
//   const {
//     name,
//     password
//   } = ctx.request.body
//   const token = sign({
//     name
//   })
//   ctx.body = {
//     success: true,
//     token
//   }
// })

// router.post('/auth', ctx => {
//   const token = ctx.headers.authorization
//   const userinfo = verify(token)
//   ctx.body = {
//     success: true,
//     userinfo
//   }
// })

module.exports = router