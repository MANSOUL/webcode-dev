const crypto = require('crypto')

const hash = str => crypto.createHash('sha256').update(str).digest('hex')

module.exports = hash