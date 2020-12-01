const jwt = require('jsonwebtoken')
const {config} = require('../../config')

const signRefreshJWT = (payload) => {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: '30d'
  })
}

module.exports = signRefreshJWT