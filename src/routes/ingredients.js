const express = require('express')
const debug = require("debug")("app:api");
const { ingredientIdSchema, ingredientSchema } =require('../utils/schemas/ingredients')
const validationHandler = require('../utils/middleware/validationHandler')
const { ObjectId } = require('mongodb');
const { config } = require('../config')
const boom = require('@hapi/boom')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const errorBoom = require('../utils/functions/errorBoom')
const ApiKeyService = require('../services/apiKeys')
const IngredientsService = require('../services/ingredients')
const RefreshTokensService = require('../services/refreshToken')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')
const {putIngredient} = require('../utils/middleware/permissionValidation')

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
    validationHandler(ingredientIdSchema, 'params'),
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
    validationHandler(ingredientSchema, 'body'),
    async (req,res) => {
      const {body} = req;
      let ingredient= {
        ...body,
        userId: ObjectId(req.user._id)
      }
      try {
        const ingredientId = await ingredientsService.createIngredient({ingredient});
        res.status(201).json({
          message: "Ingredient created",
          id: ingredientId
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.put('/:ingredientId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['write:ingredients', 'writeAll:ingredients']),
    validationHandler(ingredientIdSchema, 'params'),
    validationHandler(ingredientSchema, 'body'),
    putIngredient(),
    async (req,res) => {
      const { ingredientId } = req.params
      const {body: ingredient} = req;
      try {
        const updatedIngredient = await ingredientsService.updateIngredient({ingredientId, ingredient});
        res.status(201).json({
          message: "Ingredient updated",
          id: updatedIngredient
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.delete('/:ingredientId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['deleteAll:ingredients']),
    validationHandler(ingredientIdSchema, 'params'),
    async (req,res) => {
      const { ingredientId } = req.params
      try {
        const deletedIngredient = await ingredientsService.deleteIngredient({ingredientId});
        res.status(201).json({
          message: "Ingredient deleted",
          id: deletedIngredient
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  
}

module.exports = ingredientsRoutes;