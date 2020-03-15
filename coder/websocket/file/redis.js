const redis = require('redis')
const client = redis.createClient()
const {
  promisify
} = require('util')
const setAsync = promisify(client.set).bind(client)
const hmSetAsync = promisify(client.hmset).bind(client)
const getAsync = promisify(client.get).bind(client)

client.flushdb( (err, succeeded) => {
  console.log(succeeded) // will be true if successfull
})

client.on('error', function (error) {
  console.error(error)
})

module.exports.set = setAsync
module.exports.hmset = hmSetAsync
module.exports.get = getAsync