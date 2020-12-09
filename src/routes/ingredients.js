const express = require('express')
const debug = require("debug")("app:api");
const { createUserSchema } =require('../utils/schemas/users')
const validationHandler = require('../utils/middleware/validationHandler')
const { config } = require('../config')
const boom = require('@hapi/boom')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const errorBoom = require('../utils/functions/errorBoom')
const ApiKeyService = require('../services/apiKeys')
const RefreshTokensService = require('../services/refreshToken')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')

require('../utils/auth/strategies/jwt')

const apiKeysService = new ApiKeyService()
const refreshTokensService = new RefreshTokensService()

const ingredientsRoutes = (app) => {
  const router = express.Router()
  app.use('/api/ingredients', router)

  router.get('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:mosvies', 'read:movies']),
    async (req,res) => {
      res.json(req.user)
    }
  )
  router.get('/:ingredientId',
    passport.authenticate('jwt', {session: false}),
    async (req,res) => {

    }
  )
  router.post('/',
    passport.authenticate('jwt', {session: false}),
    async (req,res) => {

    }
  )
  router.put('/',
    passport.authenticate('jwt', {session: false}),
    async (req,res) => {

    }
  )
  router.delete('/',
    passport.authenticate('jwt', {session: false}),
    async (req,res) => {

    }
  )
  
}

module.exports = ingredientsRoutes;