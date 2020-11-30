const MongoLib = require('../lib/mongo')

class RefreshTokensService {
  constructor() {
    this.collection = 'refresh-tokens'
    this.mongoDB = new MongoLib()
  }
  async getToekn ({ token }) {
    const [ refreshToken ] = await this.mongoDB.getAll(this.collection, { token }) 
    return refreshToken
  }
  async createToken ({token}) {
    const createdRefreshTokenId = await this.mongoDB.create(this.collection, {
      token,
      createdAt: new Date()
    })
    return createdRefreshTokenId
  }
  async deleteToken({token}) {
    const deletedRefreshTokenId = await this.mongoDB.delete(this.collection, {
      token
    })
  }
}

module.exports = RefreshTokensService
