const boom = require('@hapi/boom');
const errorBoom = require('../functions/errorBoom')
const IngredientsService = require('../../services/ingredients')
const RecipesService = require('../../services/recipes')

//pasamos el array con scopes
const ingredientsService = new IngredientsService()
const recipesService = new RecipesService()
const putIngredient = () => {
  //usamos middleware
  return async (req, res, next) => {
    const {presentScopes} = req
    const { ingredientId } = req.params

    if(presentScopes.includes('write:ingredients')) {
      const ingredient = await ingredientsService.getIngredient({ingredientId})
      let userId = req.user._id.toString()
      let ingredientUserId = ingredient.userId.toString()
      if(userId===ingredientUserId){ 
        next()
      }else{
        errorBoom(boom.forbidden("Resource doesn't belong to user"),res)
        next(boom.forbidden())
      }
    }
    if(presentScopes.includes('writeAll:ingredients')) {
      next()
    }

  }
}
const deleteIngredient = () => {
  //usamos middleware
  return async (req, res, next) => {
    const {presentScopes} = req
    const { ingredientId } = req.params

    if(presentScopes.includes('delete:ingredients')) {
      const ingredient = await ingredientsService.getIngredient({ingredientId})
      let userId = req.user._id.toString()
      let ingredientUserId = ingredient.userId.toString()
      if(userId===ingredientUserId){ 
        next()
      }else{
        errorBoom(boom.forbidden("Resource doesn't belong to user"),res)
        next(boom.forbidden())
      }
    }
    if(presentScopes.includes('deleteAll:ingredients')) {
      next()
    }

  }
}
const putRecipe = () => {
  //usamos middleware
  return async (req, res, next) => {
    const {presentScopes} = req
    const { recipeId } = req.params

    if(presentScopes.includes('write:recipes')) {
      const recipe = await recipesService.getRecipe({recipeId})
      let userId = req.user._id.toString()
      let recipeUserId = recipe.userId.toString()
      if(userId===recipeUserId){ 
        next()
      }else{
        errorBoom(boom.forbidden("Resource doesn't belong to user"),res)
        next(boom.forbidden())
      }
    }
    if(presentScopes.includes('writeAll:recipes')) {
      next()
    }

  }
}

const deleteRecipe = () => {
  //usamos middleware
  return async (req, res, next) => {
    const {presentScopes} = req
    const { recipeId } = req.params

    if(presentScopes.includes('delete:recipes')) {
      const recipe = await recipesService.getRecipe({recipeId})
      if(recipe) {
        let userId = req.user._id.toString()
        let recipeUserId = recipe.userId.toString()
        if(userId===recipeUserId){ 
          next()
        }else{
          errorBoom(boom.forbidden("Resource doesn't belong to user"),res)
          next(boom.forbidden())
        }
      }
      else {
        errorBoom(boom.badRequest("Resource doesn't exists"),res)
        next(boom.badRequest())
      }
    }
    if(presentScopes.includes('deleteAll:recipes')) {
      next()
    }

  }
}

module.exports = {
  putIngredient,
  deleteIngredient,
  putRecipe,
  deleteRecipe
};