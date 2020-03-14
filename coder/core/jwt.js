const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');

module.exports.sign = function sign(data, day = 365) {
  const token = jsonwebtoken.sign(data, config('jwtTokenSecret'), {
    expiresIn: `${day} days`
  });
  return token;
}

module.exports.verify = function verify(token) {
  try {
    const decoded = jsonwebtoken.verify(token, config('jwtTokenSecret'));
    return decoded;
  } catch (err) {
    //JsonWebTokenError: invalid signature
    console.log(err)
    return null;
  }
}