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

require('../utils/auth/strategies/basic')

const apiKeysService = new ApiKeyService()
const refreshTokensService = new RefreshTokensService()

const ingredientsRoutes = (app) => {
  const router = express.Router()
  app.use('/api/ingredients', router)

  router.get('/',
    async (req,res) => {

    }
  )
  router.get('/:ingredientId',
    async (req,res) => {

    }
  )
  router.post('/',
    async (req,res) => {

    }
  )
  router.put('/',
    async (req,res) => {

    }
  )
  router.delete('/',
    async (req,res) => {

    }
  )
  
}

module.exports = ingredientsRoutes;