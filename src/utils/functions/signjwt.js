const jwt = require('jsonwebtoken')
const {config} = require('../../config')

const signJWT = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '15m'
  });
}

module.exports = signJWT