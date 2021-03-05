const express = require('express')
const debug = require("debug")("app:api");
const { recipeIdSchema, recipeSchema } =require('../utils/schemas/recipe')
const validationHandler = require('../utils/middleware/validationHandler')
const { ObjectId } = require('mongodb');
const objectIdIngredients = require('../utils/functions/objectIdIngredients')
const passport = require('passport')
const errorBoom = require('../utils/functions/errorBoom')
const RecipesService = require('../services/recipes')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')
const {putRecipe, deleteRecipe} = require('../utils/middleware/permissionValidation')
const cacheControl = require('../utils/middleware/cacheControl')

require('../utils/auth/strategies/jwt')

const recipesService = new RecipesService()


const recipesRoutes = (app) => {
  const router = express.Router()
  app.use('/api/recipes', router)

  router.get('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:recipes']),
    cacheControl(),
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
  router.get('/search/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:recipes']),
    cacheControl(),
    async (req, res) => {
      const { queryString } = req.query
      try {
        const recipes = await recipesService.searchRecipe({text: queryString})
        res.status(200).json({
          data: recipes,
          message: "Recipes retrived"
        })

      } catch (error) {
        debug(error)
        errorBoom(error, res)
      }
    }  
  )
  router.get('/:recipeId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:recipes']),
    validationHandler(recipeIdSchema, 'params'),
    cacheControl(),
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
      let ingredients = objectIdIngredients(body.ingredients) 
      
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
  router.put('/:recipeId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['write:recipes', 'writeAll:recipes']),
    validationHandler(recipeIdSchema, 'params'),
    validationHandler(recipeSchema, 'body'),
    putRecipe(),
    async (req,res) => {
      const { recipeId } = req.params
      const {body: recipe} = req;
      let ingredients = objectIdIngredients(recipe.ingredients)
      //insert ingredients transformed to the object
      recipe.ingredients= ingredients
      try {
        const updatedRecipe = await recipesService.updateRecipe({recipeId, recipe});
        res.status(200).json({
          message: "Recipe updated",
          id: updatedRecipe
        })
      } catch (error) {
        debug(error)
        errorBoom(error,res)
      }
    }
  )
  router.delete('/:recipeId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['deleteAll:recipes','delete:recipes']),
    validationHandler(recipeIdSchema, 'params'),
    deleteRecipe(),
    async (req,res) => {
      const { recipeId } = req.params
      try {
        const deletedRecipe = await recipesService.deleteRecipe({recipeId});
        res.status(200).json({
          message: "Recipe deleted",
          id: deletedRecipe
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  
}

module.exports = recipesRoutes;