require('dotenv').config();
const config = {
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dev: process.env.NODE_ENV !== 'production',
  adminKey: process.env.ADMIN_KEY,
  regularKey: process.env.REGULAR_KEY,
  jwtSecret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
}

module.exports = { config }