const express = require('express')
const debug = require("debug")("app:api");
const { recipeIdSchema, recipeSchema } =require('../utils/schemas/recipe')
const validationHandler = require('../utils/middleware/validationHandler')
const { ObjectId } = require('mongodb');
const { config } = require('../config')
const boom = require('@hapi/boom')
const passport = require('passport')
const errorBoom = require('../utils/functions/errorBoom')
const RecipesService = require('../services/recipes')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')
const {putIngredient} = require('../utils/middleware/permissionValidation')

require('../utils/auth/strategies/jwt')

const recipesService = new RecipesService()

const recipesRoutes = (app) => {
  const router = express.Router()
  app.use('/api/recipes', router)

  router.get('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:recipes']),
    async (req,res) => {
      try {
        const recipes = await recipesService.getRecipes()
        res.status(200).json({
          data: recipes,
          message: "Recipes retrived"
        })

      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.get('/:recipeId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:recipes']),
    validationHandler(recipeIdSchema, 'params'),
    async (req,res) => {
      const { recipeId } = req.params
      try {
        const recipes = await recipesService.getRecipe({recipeId})
        res.status(200).json({
          data: recipes,
          message: "Recipes retrived"
        })

      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.post('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['write:recipes', 'writeAll:recipes']),
    validationHandler(recipeSchema, 'body'),
    async (req,res) => {
      const {body} = req;
      //transform ingredientsId into ObjectId
      let ingredients = body.ingredients.map((ingredient) => {
        let {quantity, ingredientId} = ingredient
        return {
          quantity,
          ingredientId: ObjectId(ingredientId)
        }
      })
      let recipe= {
        ...body,
        userId: ObjectId(req.user._id)
      }
      //insert ingredients transformed to the object
      recipe.ingredients = ingredients
      try {
        const recipeId = await recipesService.createRecipe({recipe});
        res.status(201).json({
          message: "Recipe created",
          id: recipeId
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  router.put('/:ingredientId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['write:ingredients', 'writeAll:ingredients']),
    validationHandler(recipeIdSchema, 'params'),
    validationHandler(recipeSchema, 'body'),
    putIngredient(),
    async (req,res) => {
      const { ingredientId } = req.params
      const {body: ingredient} = req;
      try {
        const updatedIngredient = await ingredientsService.updateIngredient({ingredientId, ingredient});
        res.status(200).json({
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
    validationHandler(recipeIdSchema, 'params'),
    async (req,res) => {
      const { ingredientId } = req.params
      try {
        const deletedIngredient = await ingredientsService.deleteIngredient({ingredientId});
        res.status(200).json({
          message: "Ingredient deleted",
          id: deletedIngredient
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  
}

module.exports = recipesRoutes;