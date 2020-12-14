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
const IngredientsService = require('../services/ingredients')
const RefreshTokensService = require('../services/refreshToken')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')

require('../utils/auth/strategies/jwt')

const apiKeysService = new ApiKeyService()
const refreshTokensService = new RefreshTokensService()
const ingredientsService = new IngredientsService()

const ingredientsRoutes = (app) => {
  const router = express.Router()
  app.use('/api/ingredients', router)

  router.get('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:ingredients']),
    async (req,res) => {
      try {
        const ingredients = await ingredientsService.getIngredients()
        res.status(200).json({
          data: ingredients,
          message: "Ingredients retrived"
        })

      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.get('/:ingredientId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:ingredients']),
    async (req,res) => {
      const { ingredientId } = req.params
      try {
        const ingredients = await ingredientsService.getIngredient({ingredientId})
        res.status(200).json({
          data: ingredients,
          message: "Ingredients retrived"
        })

      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.post('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['write:ingredients', 'writeAll:ingredients']),
    async (req,res) => {

    }
  )
  router.put('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['write:ingredients', 'writeAll:ingredients']),
    async (req,res) => {

    }
  )
  router.delete('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['deleteAll:ingredients']),
    async (req,res) => {

    }
  )
  
}

module.exports = ingredientsRoutes;